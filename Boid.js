//shapes should be size (-2, -2) x (2, 2)
//forward facing negative y
const shapes = {
  star: [
    [-0.6, 0.6],
    [0, 2],
    [0.6, 0.6],
    [2, 0],
    [0.6, -0.4],
    [0, -2],
    [-0.6, -0.4],
    [-2, 0]
  ],

  triangle: [
    [0, -2],
    [-1, 2],
    [1, 2]
  ],

  plus: [
    [-.2, 2],
    [.2, 2],
    [.2, .2],
    [2, .2],
    [2, -.2],
    [.2, -.2],
    [.2, -2],
    [-.2, -2],
    [-.2, -.2],
    [-2, -.2],
    [-2, .2],
    [-.2, .2]
  ],

  circle: [0, 0]
}

class Boid {
  constructor(x, y) {
    this.color = color(random(360), random(60, 95), random(50, 95)); //colorMode is HSB from sketch setup()
    this.r = randomGaussian((width + height) / 600, .1); //attempt auto sizing
    this.sight = 800; //the view radius of each boid for calculating movement
    this.maxSpeed = 3// randomGaussian(3, .002); //randomGaussian(median, stdDeviation);
    this.maxForce = randomGaussian(.4, 0.002);
    this.shape = "triangle" //random(Object.keys(shapes)); //picks a random shape type

    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().setMag(this.maxSpeed);
    this.acc = createVector(0, 0);
  }

  run(power) {
    this.flock(power);
    this.update();
    this.borders();
    this.draw();
  }

//loop the boids around the bordres of the screne -> toroidal space
  borders() {
    if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.y < -this.r) this.pos.y = height + this.r;
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
  }

  draw() {
    fill(this.color);
    stroke(this.color);
    strokeWeight(.6); //smooths the shapos

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + radians(90));
    beginShape();
    scale(this.r);

    if (this.shape == "circle") {
      ellipse(0, 0, 2);
    } else {
      shapes[this.shape].forEach(v => vertex(v[0], v[1]));
    }
    endShape(CLOSE);
    pop();
  }

  flock(power) {
    //find local flockmates within this.sight distance
    let neighbors = [];
    for (let i = 0; i < boids.length; i++) {
      let d = this.getBoidDist(boids[i]);
      if (d > 0 && d < this.sight)
        neighbors.push(boids[i]);
    }

    let sep = this.sep(neighbors); // Separation
    let ali = this.align(neighbors); // Alignment
    let coh = this.cohet(neighbors); // Cohesion

    sep.mult(power.x);
    ali.mult(power.y);
    coh.mult(power.z);

    this.addForce(sep);
    this.addForce(ali);
    this.addForce(coh);
  }

  addForce(force) {
    //A = Force/Mass
    force.div(this.r);
    force.limit(this.maxForce);
    this.acc.add(force);
  }

  //calculate the distance between boids factoring in the screen wrapping
  //this is toroidal space
  getBoidDist(b) {
    let dx = abs(this.pos.x - b.pos.x);
    if (dx > width / 2)
      dx = width - dx;
    let dy = abs(this.pos.y - b.pos.y);
    if (dy > height / 2)
      dy = height - dy;
    return dx * dx + dy * dy;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  sep(n) {
    //steer to avoid flockmates that are too close
    const desireDist = 200;
    let vec = createVector(0, 0);
    let count = 0;

    n.forEach(b => {
      let diff = p5.Vector.sub(this.pos, b.pos).setMag(this.maxSpeed);
      let d = this.getBoidDist(b);
      if (d > 0 && d < desireDist) {
        vec.add(diff.div(d));
        count++;
      }});

      return (count) ? this.steer(vec.setMag(this.maxSpeed), this.vel) : createVector(0, 0);
  }

  //Align Boid's velocity with it's flockmates'
  align(n) {
    let avgVel = createVector(0, 0);
    n.forEach(boid => avgVel.add(boid.vel));
    return (n.length > 0) ? this.steer(avgVel, this.vel) : createVector(0, 0);
  }

  //Steer towars the average position of local flockmates
  cohet(n) {
    let avgPos = createVector(0, 0);
    n.forEach(boid => avgPos.add(boid.pos));
    return (n.length > 0) ? this.steer(avgPos, this.pos) : createVector(0, 0);
  }

  steer(towards, from) {
    let desired = p5.Vector.sub(towards, from);
    return desired.limit(this.maxForce);
  }
}
