
let boids = [];
let boidCount = 50;
let sepSlider;
let alignSlider;
let cohetSlider;
let power;

function setup() {
  noStroke(90);
  colorMode(HSB);
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);

  //default separation, alignment, and cohesion values
  createSliders(1.8, 1, 1);

  for(let i = 0; i < boidCount; i++)
    boids.push(new Boid(width/2, height/2));

  frameRate(60);
}

function draw() {
  background(color(frameCount/6 % 360, 50 + noise(frameCount/500)*50, 50 + noise((frameCount+50)/200)*20));

  power.set(sepSlider.value(), alignSlider.value(), cohetSlider.value());

  boids.forEach(boid => boid.run(power));

  if(frameRate() < 32)
    lotterySacrifice(); //self- explanatory, we sacrifice boids to the lag gods
}

function createSliders(x,y,z) {
  power = createVector(x,y,z);

  textSize(30);
  fill(0, 0, 100);

  text("Separation", 10, 10)
  sepSlider = createSlider(0, 5, x, .05);
  sepSlider.position(10, 30);
  sepSlider.style('width', '80px');

  alignSlider = createSlider(0, 5, y, .05);
  alignSlider.position(100, 30);
  alignSlider.style('width', '80px');

  cohetSlider = createSlider(0, 5, z, .05);
  cohetSlider.position(200, 30);
  cohetSlider.style('width', '80px');
}

function mouseDragged() {
  //attempt to not add boids when moving sliders
  if(mouseX > 100 && mouseY > 50)
    boids.push(new Boid(mouseX, mouseY));
}

function mousePressed() {
  if(mouseX > 100 && mouseY > 50)
    boids.push(new Boid(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(window.innerWidth - 20, window.innerHeight - 20);
}

function lotterySacrifice() {
  console.log("framerate: " + frameRate() + " boids: " + boids.length);
  boids.splice(random(boids.length), 1);
}
