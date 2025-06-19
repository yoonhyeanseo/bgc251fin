const { Responsive } = P5Template;

let video;
let greyChars =
  '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
let stars = [];
let waves = [];
let tileW;
let tileH;

function setup() {
  new Responsive().createResponsiveCanvas(800, 600, 'contain', true);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  video.size(128, 96);
  video.loadPixels();
  tileW = width / video.width;
  tileH = height / video.height;
}

function draw() {
  background('#000000');
  noStroke();

  video.loadPixels();

  if (stars.length === 0) {
    starPower();
  }

  updateAndDrawStars();
  updateAndDrawWaves();

  for (let idx = 0; idx < video.pixels.length / 4; idx++) {
    let column = idx % video.width;
    let row = floor(idx / video.width);
    let r = video.pixels[idx * 4];
    let g = video.pixels[idx * 4 + 1];
    let b = video.pixels[idx * 4 + 2];
    let a = video.pixels[idx * 4 + 3];
    let c = color(r, g, b, a);
    let brightnessValue = brightness(c);
    let x = column * tileW;
    let y = row * tileH;
    let cx = x + tileW * 0.5;
    let cy = y + tileH * 0.5;

    let mouseDistance = dist(cx, cy, mouseX, mouseY);

    let minStarDistance = Infinity;
    for (let star of stars) {
      let starDistance = dist(cx, cy, star.x, star.y);
      if (starDistance < minStarDistance) {
        minStarDistance = starDistance;
      }
    }

    let minWaveDistance = Infinity;
    for (let wave of waves) {
      let waveDistance = abs(dist(cx, cy, wave.x, wave.y) - wave.radius);
      if (waveDistance < minWaveDistance) {
        minWaveDistance = waveDistance;
      }
    }

    let charIndex = floor(
      map(brightnessValue, 255, 0, 0, greyChars.length - 1)
    );
    let char = greyChars.charAt(charIndex);

    if (mouseDistance < 50) {
      fill(255, 50, 50);
    } else if (mouseDistance < 100) {
      fill(255, 200, 100);
    } else if (minStarDistance < 50 || minWaveDistance < 50) {
      fill(255, 100, 255);
    } else if (minStarDistance < 100 || minWaveDistance < 100) {
      fill(100, 255, 255);
    } else {
      fill(255, 255, 0);
    }

    noStroke();
    textSize(1.5 * min(tileH, tileW));
    textAlign(CENTER, CENTER);
    text(char, cx, cy);
  }
}

function mousePressed() {
  let numStarsAdded = random(5, 10);
  for (let i = 0; i < numStarsAdded; i += 1) {
    let star = createStar();
    star.x = mouseX + random(-30, 30);
    star.y = mouseY + random(-30, 30);
    stars.push(star);

    let wave = createWave(star.x, star.y);
    waves.push(wave);
  }
}

function updateAndDrawStars() {
  for (let star of stars) {
    drawStar(star);
    star.size *= 0.99;
    star.lifespan -= 1;
    if (star.lifespan <= 0) {
      let i = stars.indexOf(star);
      stars.splice(i, 1);
    }
  }
}

function starPower() {
  for (let i = 0; i < 70; i += 1) {
    let star = createStar();
    stars.push(star);

    let wave = createWave(star.x, star.y);
    waves.push(wave);
  }
}

function createStar() {
  let star = {
    x: random(20, 800),
    y: random(20, 600),
    size: random(20, 55),
    lifespan: random(30, 60),
    color: color(255, 255, 255),
  };
  return star;
}

function drawStar(star) {
  textAlign(CENTER, CENTER);
  textSize(star.size);
  fill(star.color);
  // text('✶', star.x, star.y);
}

function createWave(x, y) {
  let wave = {
    x: x,
    y: y,
    radius: 0,
    maxRadius: 150,
    speed: 3,
    lifespan: 50,
    thickness: 20,
  };
  return wave;
}

function updateAndDrawWaves() {
  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];

    wave.radius += wave.speed;
    wave.lifespan--;

    if (wave.radius > wave.maxRadius || wave.lifespan <= 0) {
      waves.splice(i, 1);
    }
  }
}
