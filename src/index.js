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

        this.imagedata = this.context.createImageData(canvas.width, canvas.height);
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
        renderWallSegment(45, 120, 160, 0, 128, 0, 255, this.renderBuffer);
    }

}

// Rendering functions
function drawRect(xStart, yStart, xEnd, yEnd, r, g, b, a, renderBuffer) {
    const stride = 4;

    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            const pixelIndex = ((y * renderBuffer.width) + x) * stride;

            renderBuffer.imagedata.data[pixelIndex] = r;
            renderBuffer.imagedata.data[pixelIndex + 1] = g;
            renderBuffer.imagedata.data[pixelIndex + 2] = b;
            renderBuffer.imagedata.data[pixelIndex + 3] = a;
        }
    }
}

function renderWallSegment(xPos, yStart, yEnd, r, g, b, a, renderBuffer) {
    const stride = 4;

    for (let y = yStart; y < yEnd; y++) {
        const pixelIndex = ((y * renderBuffer.width) + xPos) * stride;

        renderBuffer.imagedata.data[pixelIndex] = r;
        renderBuffer.imagedata.data[pixelIndex + 1] = g;
        renderBuffer.imagedata.data[pixelIndex + 2] = b;
        renderBuffer.imagedata.data[pixelIndex + 3] = a;
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