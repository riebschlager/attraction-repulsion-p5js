const VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
    VerletParticle2D = toxi.physics2d.VerletParticle2D,
    AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior,
    GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
    ConstantForceBehavior = toxi.physics2d.behaviors.ConstantForceBehavior,
    Vec2D = toxi.geom.Vec2D,
    Rect = toxi.geom.Rect;

class Particle extends VerletParticle2D {

    constructor(x, y, w, maxRadius) {
        super(x, y, w);
        this.radiusNoise = Math.random() * 1000;
        this.colorNoise = Math.random() * 1000;
        this.maxRadius = maxRadius;
    }
}

class Attractor extends AttractionBehavior {

    constructor(position, radius, strength, jitter, behavior) {
        super(position, radius, strength, jitter);
        this.position = position;
        this.xNoise = Math.random() * 1000;
        this.yNoise = Math.random() * 1000;
        this.strengthNoise = Math.random() * 1000;
        this.behavior = behavior;
    }
}



let physics;
let attractors = [];

const sketch = p => {

    let canvas;
    const SKETCH_WIDTH = window.innerWidth;
    const SKETCH_HEIGHT = window.innerHeight;

    function addAttractor(behavior) {
        let a = new Attractor(new toxi.geom.Vec2D({ x: p.mouseX, y: p.mouseY }), p.width / 3, 0, 0, behavior);
        physics.addBehavior(a);
        attractors.push(a);
    }

    function addParticle() {
        let particle = new VerletParticle2D({
            x: Math.random() * SKETCH_WIDTH,
            y: Math.random() * SKETCH_HEIGHT,
            weight: Math.random() * 20
        });
        physics.addParticle(particle);
    }

    p.keyPressed = e => {
        if(e.key == 'a' || e.key == 'A') addAttractor(1);
        if(e.key == 'r' || e.key == 'R') addAttractor(-1);
        if(e.key == 'c' || e.key == 'C') {

        }
        if(e.key == ' ') attractors.length = 0;
        if(e.key == 'q') physics.clear();
        if(e.key == 'p' || e.key == 'P') {
            for(let i = 0; i < 100; i++) addParticle();
        }
        if(e.key == 's' || e.key == 'S') {
        }
    }


    p.setup = function() {
        p.pixelDensity(1);
        canvas = p.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);
        canvas.parent('sketch');
        physics = new VerletPhysics2D();
        physics.setDrag(0.75);
        p.background(255);
    };

    p.draw = function() {
        physics.update();
        p.loadPixels();
        physics.particles.forEach(particle => {
            let x = Math.floor(particle.x);
            let y = Math.floor(particle.y);
            let offset = (SKETCH_WIDTH * y + x) * 4;

            p.pixels[offset + 0] -= 50;
            p.pixels[offset + 1] -= 50;
            p.pixels[offset + 2] -= 50;

            p.pixels[offset + 0] = p.pixels[offset + 0] <= 0 ? 0 : p.pixels[offset + 0];
            p.pixels[offset + 1] = p.pixels[offset + 1] <= 0 ? 0 : p.pixels[offset + 1];
            p.pixels[offset + 2] = p.pixels[offset + 2] <= 0 ? 0 : p.pixels[offset + 2];
        });
        p.updatePixels();

        for(let i = 0; i < attractors.length; i++) {
            let a = attractors[i];
            if(a.behavior == 1) a.setStrength(p.map(p.noise(a.strengthNoise), 0, 1, 0, 2));
            if(a.behavior == -1) a.setStrength(p.map(p.noise(a.strengthNoise), 0, 1, -2, 0));
            a.position.x = p.map(p.noise(a.xNoise), 0, 1, 0, SKETCH_WIDTH);
            a.position.y = p.map(p.noise(a.yNoise), 0, 1, 0, SKETCH_HEIGHT);
            a.strengthNoise += 0.005;
            a.xNoise += 0.0025;
            a.yNoise += 0.0025;
        }
    };

    let mousePos, mouseAttractor;

    p.mousePressed = function() {

    }

    p.mouseDragged = function() {
    }

    p.mouseReleased = function() {
    }

};

const myp5 = new p5(sketch);
