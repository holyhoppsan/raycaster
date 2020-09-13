// Class definitions
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class RenderBuffer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.stride = 4;

        this.imagedata = this.context.createImageData(canvas.width, canvas.height);
    }

    plotPixel(x, y, r, g, b, a) {
        const pixelIndex = ((y * this.imagedata.width) + x) * this.stride;

        this.imagedata.data[pixelIndex] = r;
        this.imagedata.data[pixelIndex + 1] = g;
        this.imagedata.data[pixelIndex + 2] = b;
        this.imagedata.data[pixelIndex + 3] = a;
    }


    applyImageData = () => {
        this.context.putImageData(this.imagedata, 0, 0);
    }
}

class Application {
    constructor() {
        this.frameDeltaComparisonEpsilon = 1;
        this.oneSecInMS = 1000;
        this.timeSinceLastTick = 0;
        this.previousTimeStampMs = 0;
        this.fpsInterval;
        this.renderBuffer = new RenderBuffer(document.getElementById("viewport"));
    }

    init = (fps) => {
        this.fpsInterval = this.oneSecInMS / fps;
        this.previousTimeStampMs = 0;
        this.timeSinceLastTick = 0;
    }

    update = (timeStamp) => {
        const targetFrameRate = document.getElementById("framelimiter").value;
        this.fpsInterval = this.oneSecInMS / targetFrameRate;
        const frameRateIsUnbound = targetFrameRate == 0;

        let elapsedTimeMs = timeStamp - this.previousTimeStampMs;
        this.previousTimeStampMs = timeStamp;

        this.timeSinceLastTick += elapsedTimeMs;

        if (frameRateIsUnbound || Math.abs(this.timeSinceLastTick - this.fpsInterval) < this.frameDeltaComparisonEpsilon || this.timeSinceLastTick > this.fpsInterval) {

            //do rendering here.
            this.render(this.timeSinceLastTick);

            const currentFPS = this.oneSecInMS / this.timeSinceLastTick;

            document.getElementById("result").textContent = `Current fps = ${currentFPS}, current frame time = ${this.timeSinceLastTick} ms`;

            this.timeSinceLastTick = 0;
        }

        window.requestAnimationFrame(this.update);
    }

    render = (delta) => {
        this.renderBackground();

        this.renderWalls();

        this.renderBuffer.applyImageData();
    }

    renderBackground = () => {
        // Render the sky
        drawRect(0, 0, this.renderBuffer.width, this.renderBuffer.height / 2, 135, 206, 250, 255, this.renderBuffer);

        // Render floor
        drawRect(0, this.renderBuffer.height / 2, this.renderBuffer.width, this.renderBuffer.height, 0, 0, 0, 255, this.renderBuffer);
    }

    renderWalls = () => {
        renderWallSegment(45, 120, 160, 255, 0, 0, 255, this.renderBuffer);

        drawLineDDA(40, 160, 50, 120, 0, 0, 255, 255, this.renderBuffer);
    }

}

// Rendering functions
function drawRect(xStart, yStart, xEnd, yEnd, r, g, b, a, renderBuffer) {
    for (let x = xStart; x <= xEnd; x++) {
        for (let y = yStart; y <= yEnd; y++) {
            renderBuffer.plotPixel(x, y, r, g, b, a);
        }
    }
}

function drawLineDDA(xStart, yStart, xEnd, yEnd, r, g, b, a, renderBuffer) {
    const dx = xEnd - xStart;
    const dy = yEnd - yStart;

    let steps;
    if (Math.abs(dx) > Math.abs(dy)) {
        steps = Math.abs(dx);
    } else {
        steps = Math.abs(dy);
    }

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = xStart;
    let y = yStart;

    //plot initial pixel
    renderBuffer.plotPixel(x, y, r, g, b, a);

    for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
        x += xIncrement;
        y += yIncrement;

        renderBuffer.plotPixel(Math.round(x), Math.round(y), r, g, b, a);
    }
}

function renderWallSegment(xPos, yStart, yEnd, r, g, b, a, renderBuffer) {
    for (let y = yStart; y <= yEnd; y++) {
        renderBuffer.plotPixel(xPos, y, r, g, b, a);
    }
}

// Callback when the window is loaded
window.onload = function () {

    function main(tframe) {
        let app = new Application();
        app.init(30);
        app.update(0);
    }

    main(0);
}