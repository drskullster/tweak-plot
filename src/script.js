params = {
    lines: 50,
    spacing: 6,
    res: 200,
    phase: 0,
    waves: 5,

    xscale: -30,
    // yscale: 20,
    ximult: 0.7,
    xjmult: -3,
    // yimult: -2.5,
    // yjmult: 14.3,
    ampMin: 0,
    ampMax: 5,
    periodMin: 50,
    periodMax: 300,
}

paramsFormat = {
    waves: {step: 1},
    xscale: { min: -200, max: 200, step: 1 },
    ximult: { min: -3, max: 3, step: 0.01 },
    xjmult: { min: -3, max: 3, step: 0.01 },
}

let waves = [], randomPeriods = [], colors;

function handleMidiMessage({ command, channel, note, velocity }) {
    if (command === 11) {
        switch (note) {
            case 1:
                clear();
                seed();
                loop();
                break;
            case 2:
                params.phase = map(velocity, 0, 1, 0, 30);
                clear();
                loop();
                break;
            case 3:
                params.ampMin = map(velocity, 0, 1, -20, 20);
                clear();
                loop();
                break;
            case 4:
                params.ampMax = map(velocity, 0, 1, -20, 20);
                clear();
                loop();
                break;
        }
    }

    if (command === 9 && note === 53 && velocity === 1) {
        clear();
        seed();
        loop();
    }
}

function setup() {
    createCanvas(421, 595, SVG);

    seed();
}

function draw() {
    noFill();
    stroke(0);

    translate(0, height / 2 - (params.lines * params.spacing) / 2);

    for (let i = 0; i < params.lines; i++) {
        const y = i * (params.spacing);
        beginShape();
        for (let j = 0; j < params.res; j++) {
            const x = j * (width / params.res);
            let yOffset = 0;

            const waveX = cos(params.phase + radians(i * params.ximult + j * params.xjmult)) * params.xscale;
            // const waveY = sin(params.phase + radians(i * params.yimult + j * params.yjmult)) * params.yscale;

            waves.forEach((wave) => {
                yOffset += wave.evaluate(x, i);
            })
            vertex(waveX + x, y + yOffset);
        }
        endShape();
    }

    noLoop();
}

class Wave {
    constructor(period, phase) {
        this.period = period;
        this.phase = phase;
    }

    evaluate(x, y) {
        // const amp = map(y, 0, params.lines, -this.amplitude / 2, this.amplitude / 2);
        const amp = map(y, 0, params.lines, params.ampMin, params.ampMax);
        return sin(this.phase + TWO_PI * (x / this.period)) * amp;
    }

    update() {
        this.phase += 0.05;
    }
}

function seed() {
    randomPeriods = [];
    waves = [];

    for (let i = 0; i < params.waves; i++) {
        randomPeriods[i] = random(params.periodMin, params.periodMax);
    }

    for (let i = 0; i < int(params.waves); i++) {
        waves[i] = new Wave(randomPeriods[i], params.phase);
    }
}