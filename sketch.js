let boids = [];
let sliders;
let music;

function preload() {
  music = loadSound("AmbientMotivational.mp3");
}

function setup() {
  colorMode(HSB);

  let boidCount = isMobileDevice() ? 50 : 100;
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);

  //default separation, alignment, and cohesion values
  sliders = createSliders(1.5, 1, 1);

  for (let i = 0; i < boidCount; i++)
    boids.push(new Boid(randomGaussian(width / 2, width / 10), randomGaussian(height / 2, height / 10)));

  music.play();
}

//loops once a frame to draw and run the boidos
function draw() {
  //changes the color smoothly using color(hue, sat, lightness)
  //(360, 100, 100) -> (360, 10-50, 40-80)
  background(color(frameCount / 6 % 360, 30 + 20 * noise(frameCount / 500), 60 + 20 * noise((frameCount + 10) / 200)));

  let power = createVector(sliders[0].value(), sliders[1].value(), sliders[2].value());
  boids.forEach(boid => boid.run(power));

  if (boids.length > 200)
    boids.splice(random(boids.length), 1);
}

//setup function
function createSliders(x, y, z) {
  let sepSlider, alignSlider, cohetSlider;

  sepSlider = createSlider(0, 4, x, .01);
  sepSlider.position(10, 30);
  sepSlider.style('width', '80px');

  alignSlider = createSlider(0, 3, y, .1);
  alignSlider.position(100, 30);
  alignSlider.style('width', '80px');

  cohetSlider = createSlider(0, 3, z, .1);
  cohetSlider.position(200, 30);
  cohetSlider.style('width', '80px');

  return [sepSlider, alignSlider, cohetSlider];
}

function mouseDragged() {
  //attempt to not add boids when moving sliders
  if (mouseX > 100 && mouseY > 50)
    boids.push(new Boid(mouseX, mouseY));
}

function mousePressed() {
  if (mouseX > 100 && mouseY > 50)
    boids.push(new Boid(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(window.innerWidth - 20, window.innerHeight - 20);
}

//toggle play/pause for music and drawloop with the space-bar
function keyPressed() {
  if (keyCode == 32) {
    if (music.isPlaying()) {
      music.stop();
      noLoop();
    } else {
      music.play();
      loop();
    }
  }
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
