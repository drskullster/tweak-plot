params = {
    radius: 60,
    res: 200,
    // xScl: 0.00009,
    xScl: 0,
    // yScl: 0.001,
    yScl: 0,
    // radiusStep: 20,
    radiusStep: 10,
    totalCircles: 30,
    angleStep: 0,
}

paramsFormat = {
    xScl: { min: 0, max: 0.0015 },
    yScl: { min: 0.001, max: 0.01 },
    angleStep: { min: 0, max: 2 },
}

let xoff = 0, yoff = 0, rotateStep, startAngle, endAngle;


function handleMidiMessage({ command, channel, note, velocity }) {
    if (command === 11) {
        switch (note) {
            case 1:
                params.angleStep = map(velocity, 0, 1, -0.5, 0.5);
                clear();
                loop();
                break;
            case 2:
                params.radiusStep = map(velocity, 0, 1, 5, 20);
                clear();
                loop();
                break;
            case 3:
                params.xScl = map(velocity, 0, 1, 0, 0.0001);
                clear();
                loop();
                break;
            case 4:
                params.yScl = map(velocity, 0, 1, 0, 0.02);
                clear();
                loop();
                break;
        }
    }

    if (command === 9 && note === 53 && velocity === 1) {
        seed();
        clear();
        loop();
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
    startAngle = -PI;
    endAngle = PI;
    xoff = 0;
    yoff = 0;
}

function draw() {
    noFill();
    stroke(0);
    startAngle = -PI;
    endAngle = PI;
    xoff = 0;
    yoff = 0;
    
    rotateStep = -PI / params.totalCircles;

    translate(width / 2, height / 2);

    for (let i = 0; i < params.totalCircles; i++) {
        drawCircle(params.radius + (i * params.radiusStep));
    }

    noLoop();
}

function drawCircle(radius) {
    beginShape();
    for (let i = 0; i < params.res; i++) {
        let angle = map(i, 0, params.res, startAngle, endAngle);
        let n = noise(sin(angle) * map(params.angleStep, 0, 2, -1, 1), cos(xoff), yoff);
        let x = floor(cos(angle) * radius);
        let y = floor(sin(angle) * radius);

        x *= n;
        y *= n;

        vertex(x, y);

        xoff += params.xScl;
    }
    yoff += params.yScl;
    endShape(CLOSE);

    rotate(rotateStep);
    translate(0, radius / 200);
}

function seed() {
    noiseSeed(random(0, 25500));
    startAngle = -PI;
    endAngle = PI;
    xoff = 0;
    yoff = 0;
}