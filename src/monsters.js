let openSimplex = openSimplexNoise(Date.now());

params = {
    radius: 50,
    res: 200,
    xScl: 0.02,
    yScl: 0.02,
    zScl: 0.1,
    radiusStep: 5,
    totalCircles: 25,
    angleStep: 0,
}

paramsFormat = {
    xScl: { min: 0.02, max: 0.3 },
    yScl: { min: 0.02, max: 0.3 },
    zScl: { min: 0, max: 2 },
    angleStep: { min: 0, max: Math.PI / 50 },
}

let buttonIsPressed = -1;

function handleMidiMessage({ command, channel, note, velocity }) {
    if (command === 11 || command === 176) {
        switch (note) {
            case 1:
                params.xScl = map(velocity, 0, 1, paramsFormat.xScl.min, paramsFormat.xScl.max);
                clear();
                loop();
                break;
            case 2:
                params.yScl = map(velocity, 0, 1, paramsFormat.yScl.min, paramsFormat.yScl.max);
                clear();
                loop();
                break;
            case 3:
                params.angleStep = map(velocity, 0, 1, paramsFormat.angleStep.min, paramsFormat.angleStep.max);
                clear();
                loop();
                break;
            case 4:
                params.zScl = map(velocity, 0, 1, paramsFormat.zScl.min, paramsFormat.zScl.max);
                clear();
                loop();
                break;
        }
    }

    // we start monitoring the click on any of the two buttons (velocity = 1)
    // when button is released (velocity = 0) we check if it was a short press or a long press
    // short press means reseed, long press means save
    if (command === 9 && (note === 52 || note === 53)) {
        if (velocity === 1) {
            buttonIsPressed = Date.now();
        } else {
            if (buttonIsPressed < Date.now() - 500) {
                // long press
                saveFile(() => {
                    clear();
                    reset();
                    seed();
                    loop();
                });
            } else {
                // short press
                seed();
                clear();
                loop();
            }
        }
    }
}

function preload() {
    const n = loadJSON('/print-number', (data) => {
        printNumber = data;
        loop();
    });
}

function setup() {
    createCanvas(421, 595, SVG);
    seed();
    xoff = 0;
    yoff = 0;
}

function draw() {
    noFill();
    stroke(0);
    xoff = 0;
    yoff = 0;

    translate(width / 2, height / 2);

    for (let i = 0; i < params.totalCircles; i++) {
        drawCircle(params.radius + (i * params.radiusStep));
    }

    noLoop();
}

function drawCircle(radius) {
    beginShape();
    const radiansPerStep = (Math.PI * 2) / params.res
    for (let angle = 0; angle < PI * 2; angle += radiansPerStep) {
        let x = cos(angle) * (radius / width);
        let y = sin(angle) * (radius / height);

        const n = map(openSimplex.noise3D(x, y, params.zScl), -1, 1, 0, 1) * Math.PI * 5;
        // const n = noise(x, y, params.zScl) * Math.PI * 5;

        const newX = x + (params.xScl * Math.cos(n));
        const newY = y + (params.yScl * Math.sin(n));

        vertex(w(newX), h(newY));
    }
    endShape();

    rotate(params.angleStep);
}

function seed() {
    openSimplex = openSimplexNoise(Date.now());
    noiseSeed(random(10000));
}

function reset() {
    params.xScl = 0;
    params.yScl = 0;
    params.angleStep = 0;
}


function w(val) {
    if (val == null)
        return width;
    return val * width;
}

function h(val) {
    if (val == null)
        return height;
    return val * height;
}