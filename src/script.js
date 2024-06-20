class Game {
    constructor() {
        this._canvas = document.getElementById('screen');

        // Set higher resolution for the canvas
        this._canvas.width = 1920; // High resolution width
        this._canvas.height = 1080; // High resolution height

        this._context = this.canvas.getContext('2d');

        // Set the CSS width and height to keep the visual size same
        this._canvas.style.width = '960px'; // Visual size width
        this._canvas.style.height = '540px'; // Visual size height

        this._width = this._canvas.width;
        this._height = this._canvas.height;
        this._graphics = [];
        this._running = false;
        this._pressedKey = null;

        this.initializeSliders();
    }

    initializeSliders() {
        const sliders = document.querySelectorAll('.slider');
        sliders.forEach(slider => {
            if (slider.id.endsWith('x')) {
                slider.min = -this._width / 2;
                slider.max = this._width / 2;
            } else if (slider.id.endsWith('y')) {
                slider.min = -this._height / 2;
                slider.max = this._height / 2;
            } else if (slider.id.endsWith('z')) {
                slider.min = -500; // Set a reasonable z-range
                slider.max = 500;
            }
        });
    }

    update() {
        // Update the game state
        console.log('Updating the game state');

        // Render the game
        this.render();

        // Request the next frame
        window.requestAnimationFrame(() => this.update());
    }

    render() {
        // Clear the canvas
        this._context.clearRect(0, 0, this._width, this._height);

        // Render all graphics
        this._graphics.forEach(graphic => {
            graphic.draw(this._context, 1000, this._canvas); // Assuming a fixed distance 'd' for projection
        });
    }

    start() {
        console.log('Starting to run the game loop');
        this._running = true;
    }

    stop() {
        console.log('Stopping the game loop');
        this._running = false;
    }

    toggleRunning() {
        if (this._running) {
            this.stop();
        } else {
            this.start();
        }
    }

    get canvas() {
        return this._canvas;
    }

    get context() {
        return this._context;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get graphics() {
        return this._graphics;
    }

    get running() {
        return this._running;
    }

    set running(value) {
        this._running = value;
    }

    set graphics(value) {
        this._graphics = value;
    }

    get pressedKey() {
        return this._pressedKey;
    }

    set pressedKey(value) {
        this._pressedKey = value;
    }
}

class Triangle {
    constructor(points) {
        this.points = points || [
            new Point(50.5, 50.5, 100),
            new Point(100.5, 50.5, 100),
            new Point(75.5, 100.5, 100)
        ];
    }

    draw(ctx, d, canvas) {
        const projectedPoints = this.points.map(point => point.project(d));
        ctx.beginPath();
        ctx.moveTo(projectedPoints[0].x + canvas.width / 2, -projectedPoints[0].y + canvas.height / 2);
        ctx.lineTo(projectedPoints[1].x + canvas.width / 2, -projectedPoints[1].y + canvas.height / 2);
        ctx.lineTo(projectedPoints[2].x + canvas.width / 2, -projectedPoints[2].y + canvas.height / 2);
        ctx.closePath();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    updatePoints(points) {
        this.points = points;
    }
}

class Cube {
    constructor(points) {
        this.points = points;
        this.triangles = [
            new Triangle([points[0], points[1], points[2]]),
            new Triangle([points[0], points[2], points[3]]),
            new Triangle([points[4], points[5], points[6]]),
            new Triangle([points[4], points[6], points[7]]),
            new Triangle([points[0], points[1], points[5]]),
            new Triangle([points[0], points[5], points[4]]),
            new Triangle([points[2], points[3], points[7]]),
            new Triangle([points[2], points[7], points[6]]),
            new Triangle([points[0], points[3], points[7]]),
            new Triangle([points[0], points[7], points[4]]),
            new Triangle([points[1], points[2], points[6]]),
            new Triangle([points[1], points[6], points[5]])
        ];
    }

    draw(ctx, d, canvas) {
        this.triangles.forEach(triangle => triangle.draw(ctx, d, canvas));
    }

    updatePoints(points) {
        this.points = points;
        this.triangles = [
            new Triangle([points[0], points[1], points[2]]),
            new Triangle([points[0], points[2], points[3]]),
            new Triangle([points[4], points[5], points[6]]),
            new Triangle([points[4], points[6], points[7]]),
            new Triangle([points[0], points[1], points[5]]),
            new Triangle([points[0], points[5], points[4]]),
            new Triangle([points[2], points[3], points[7]]),
            new Triangle([points[2], points[7], points[6]]),
            new Triangle([points[0], points[3], points[7]]),
            new Triangle([points[0], points[7], points[4]]),
            new Triangle([points[1], points[2], points[6]]),
            new Triangle([points[1], points[6], points[5]])
        ];
    }

    rotateX(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.points.forEach(point => {
            const y = point.y * cos - point.z * sin;
            const z = point.y * sin + point.z * cos;
            point.y = y;
            point.z = z;
        });
        this.updatePoints(this.points);
    }

    rotateY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.points.forEach(point => {
            const x = point.x * cos - point.z * sin;
            const z = point.x * sin + point.z * cos;
            point.x = x;
            point.z = z;
        });
        this.updatePoints(this.points);
    }
}

class Point {
    constructor(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get z() {
        return this._z;
    }

    set z(value) {
        this._z = value;
    }

    project(d) {
        return {
            x: (this.x * d) / (d - this.z),
            y: (this.y * d) / (d - this.z)
        };
    }
}

// Initialize and start the game
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    const initialPoints = [
        new Point(-250, -250, -250), new Point(250, -250, -250),
        new Point(250, 250, -250), new Point(-250, 250, -250),
        new Point(-250, -250, 250), new Point(250, -250, 250),
        new Point(250, 250, 250), new Point(-250, 250, 250)
    ];
    const cube = new Cube(initialPoints);
    game.graphics.push(cube);

    // Initialize slider values based on the initial points
    initialPoints.forEach((point, index) => {
        document.getElementById(`slider${index + 1}x`).value = point.x;
        document.getElementById(`slider${index + 1}y`).value = point.y;
        document.getElementById(`slider${index + 1}z`).value = point.z;
    });

    // Start the update loop immediately
    game.update();

    let angleX = 0;
    let angleY = 0;
    const rotateSpeedX = 0.001;
    const rotateSpeedY = 0.002;

    document.addEventListener('keydown', (event) => {
        game.pressedKey = event.key;
        if (event.key === 'Enter') {
            game.toggleRunning();
        }
    });

    const updateCubePoints = () => {
        const points = [];
        for (let i = 1; i <= 8; i++) {
            points.push(new Point(
                parseFloat(document.getElementById(`slider${i}x`).value),
                parseFloat(document.getElementById(`slider${i}y`).value),
                parseFloat(document.getElementById(`slider${i}z`).value)
            ));
        }
        cube.updatePoints(points);
    };

    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', updateCubePoints);
    });

    updateCubePoints(); // Initialize cube points based on slider values

    // Animation loop for rotating the cube
    const animate = () => {
        if (game.running) {
            angleX += rotateSpeedX;
            angleY += rotateSpeedY;
            cube.rotateX(rotateSpeedX); // Rotate around X axis
            cube.rotateY(rotateSpeedY); // Rotate around Y axis
        }
        window.requestAnimationFrame(animate);
    };

    animate();
});
