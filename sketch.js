
let boids = [];
let sliders;
let music;

function setup() {
  noStroke(90);
  colorMode(HSB);
  if(isMobileDevice()) {
    createCanvas(displayWidth, displayHeight);
    boidCount = 20;
  } else {
    createCanvas(window.innerWidth - 20, window.innerHeight - 20);
    boidCount = 75;
  }

  //default separation, alignment, and cohesion values
  sliders = createSliders(1.5, 1, 1);

  music = loadSound("AmbientMotivational.mp3");

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

  sepSlider = createSlider(0, 10, x, .1);
  sepSlider.position(10, 30);
  sepSlider.style('width', '80px');

  alignSlider = createSlider(0, 10, y, .1);
  alignSlider.position(100, 30);
  alignSlider.style('width', '80px');

  cohetSlider = createSlider(0, 3, z, .1);
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
  music.isPlaying()? music.stop(): music.play();
  if(mouseX > 100 && mouseY > 50)
    boids.push(new Boid(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(window.innerWidth - 20, window.innerHeight - 20);
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
