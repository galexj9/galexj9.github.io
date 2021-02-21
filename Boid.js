//shapes should be size (-2, -2) x (2, 2)
//forward facing negative y
let shapes = [
  //4 point concave star
  [[-0.6, 0.6], [0, 2], [0.6, 0.6], [2, 0],
  [0.6, -0.4], [0, -2], [-0.6, -0.4], [-2, 0]],
  //triangle
  [[0, -2], [-1, 2], [1, 2]],

  //plus sign
  [[-.2, 2], [.2, 2], [.2, .2],
  [2, .2], [2, -.2], [.2, -.2],
  [.2, -2], [-.2, -2], [-.2, -.2],
  [-2, -.2], [-2, .2], [-.2, .2]]
];

class Boid {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.color = color(random(360), random(75, 100), random(75, 100));  //colorMode is HSB from sketch setup()
    this.r = random(width/400, width/200); //adjust addForce(f) if changed
    this.sight = 75; //the view radius of each boid for calculating movement
    this.maxSpeed = random(3, 4);
    this.maxForce = .05;
    this.shape = random(shapes);
  }

  run(power) {
    this.flock(power);
    this.update();
    this.borders();
    this.draw();
  }

  borders() {
  if (this.pos.x < -this.r)  this.pos.x = width + this.r;
  if (this.pos.y < -this.r)  this.pos.y = height + this.r;
  if (this.pos.x > width + this.r) this.pos.x = -this.r;
  if (this.pos.y > height + this.r) this.pos.y = -this.r;
}

  draw() {
    // Draw a triangle rotated in the direction of velocity
    fill(this.color);
    stroke(this.color);
    strokeWeight(1);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + radians(90));
    beginShape();
    scale(this.r);
    this.shape.forEach(v => vertex(v[0], v[1]));
    endShape(CLOSE);
    pop();
  }

  flock(power) {
    //find local flockmates within this.sight distance
    let neighbors = [];
    for(let i = 0; i < boids.length; i++) {
      let d = this.getBoidDist(boids[i]);
      if (d > 0 && d < this.sight)
        neighbors.push(boids[i]);
    }

    let sep = this.sep(neighbors);   // Separation
    let ali = this.align(neighbors);      // Alignment
    let coh = this.cohet(neighbors);   // Cohesion

    sep.mult(power.x);
    ali.mult(power.y);
    coh.mult(power.z);

    this.addForce(sep);
    this.addForce(ali);
    this.addForce(coh);
  }

  addForce(force) {
    //A = Force/Mass
    force.div(this.r/3); // 3 is the minimum mass, scale to 1
    force.limit(this.maxForce);
    this.acc.add(force);
  }

  //calculate the distance between boids factoring in the screen wrapping
  //this is toroidal space
  getBoidDist(b) {
    /*
    let dx = abs(this.pos.x - b.pos.x);
    if(dx > width/2)
      dx = width - dx;
    let dy = abs(this.pos.y - b.pos.y);
    if(dy > height/2)
      dy = height - dy;
    return dx*dx + dy*dy;
    */
    return p5.Vector.dist(this.pos, b.pos);
  }

//maps a relative boid position in the toroidal space back to cartesian corrodinates for doing math to
  unwrapPos(b) {
    let mappedPos = b.pos;
    if(abs(this.pos.x - b.pos.x) > width/2)
      mappedPos.x = width - mappedPos.x;
    if(abs(this.pos.y - b.pos.y) > height/2)
      mappedPos.y = height - mappedPos.y;
    return mappedPos;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  sep(n) {
    //steer to avoid flockmates that are too close
    let desireDist = 25;
    let steer = createVector(0,0);
    for(let i = 0; i < n.length; i++) {
      let d = this.getBoidDist(n[i]);
      let diff = p5.Vector.sub(this.pos, n[i].pos);
      diff.normalize();
      if (diff > 0) diff.div(d);
      steer.add(diff);
    }
    steer.div(n.length+1);

    if (steer.magSq() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

//Align Boid's velocity with it's flockmates'
  align(n) {
    //steer towards average heading of flockmates
    let avgVel = createVector(0,0);
    n.forEach(boid => avgVel.add(boid.vel));
    if(n.length > 0) {
      avgVel.div(n.length);
      avgVel.normalize();
      avgVel.mult(this.maxSpeed);
      let steer = p5.Vector.sub(avgVel, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0,0);
    }
  }

//steer towars the average position of local flockmates
  cohet(n) {
    let avgPos = createVector(0,0);
    //unwrap the toroidal position of the boids back to cartesian space
    n.forEach(boid => avgPos.add(boid.pos));
    if(n.length > 0) {
      avgPos.div(n.length);

      let desired = p5.Vector.sub(avgPos, this.pos);
      desired.normalize();
      desired.mult(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }

  }
}
