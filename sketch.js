
let boids = [];
let boidCount = 50;
let sliders;

function setup() {
  noStroke(90);
  colorMode(HSB);
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);

  //default separation, alignment, and cohesion values
  sliders = createSliders(1.6, 1.4, 1.5);

  for(let i = 0; i < boidCount; i++)
    boids.push(new Boid(width/2, height/2));

  frameRate(60);
}

//loops once a frame to draw and run the boidos
function draw() {
  background(color(frameCount/6 % 360, 30 + noise(frameCount/500)*20, 60 + noise((frameCount+50)/200)*20));

  let power = createVector(sliders.x.value(), sliders.y.value(), sliders.z.value());
  boids.forEach(boid => boid.run(power));

  if(boids.length > 200)
    boids.splice(random(boids.length), 1);
}

//setup function
function createSliders(x,y,z) {
  let sepSlider, alignSlider, cohetSlider;

  sepSlider = createSlider(0, 5, x, .05);
  sepSlider.position(10, 30);
  sepSlider.style('width', '80px');

  alignSlider = createSlider(0, 5, y, .05);
  alignSlider.position(100, 30);
  alignSlider.style('width', '80px');

  cohetSlider = createSlider(0, 5, z, .05);
  cohetSlider.position(200, 30);
  cohetSlider.style('width', '80px');

  return createVector(sepSlider, alignSlider, cohetSlider);
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
