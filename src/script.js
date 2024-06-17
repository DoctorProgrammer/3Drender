class Game {
    constructor() {
        this._canvas = document.getElementById('screen');
        this._context = this.canvas.getContext('2d');
        this._width = this._canvas.width;
        this._height = this._canvas.height;
        this._graphics = [];
        this._running = false;
    }

    update() {
        if (this.running) {
            this.render();
            this.update();
        }
    }

    render() {
        console.log('Rendering the game');
    }

    start() {
        console.log('Starting to run the game loop');
        this.running = true;
        this.update();
    }

    stop() {
        console.log('Stopping the game loop');
        this.running = false;
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
        ctx.moveTo(projectedPoints[0].x + canvas.width / 2, projectedPoints[0].y + canvas.height / 2);
        ctx.lineTo(projectedPoints[1].x + canvas.width / 2, projectedPoints[1].y + canvas.height / 2);
        ctx.lineTo(projectedPoints[2].x + canvas.width / 2, projectedPoints[2].y + canvas.height / 2);
        ctx.closePath();
        ctx.strokeStyle = 'black';
        ctx.stroke();
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
}

// Initialize and start the game
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.graphics.push(new Triangle());

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            game.stop();
        } else if (event.key === 'Enter') {
            game.start();
        } else {
            console.log('Unknown key pressed: ', event.key);
        }
    });
});
