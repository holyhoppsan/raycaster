// Class definitions
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Color {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
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

    plotPixel(x, y, color) {
        const pixelIndex = ((y * this.imagedata.width) + x) * this.stride;

        this.imagedata.data[pixelIndex] = color.r;
        this.imagedata.data[pixelIndex + 1] = color.g;
        this.imagedata.data[pixelIndex + 2] = color.b;
        this.imagedata.data[pixelIndex + 3] = color.a;
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

            // Update game logic

            // Do rendering here.
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
        const skyStartCoord = new Vector2D(0, 0);
        const skyEndCoord = new Vector2D(this.renderBuffer.width, this.renderBuffer.height / 2);
        const skyColor = new Color(135, 206, 250, 255);
        drawRect(skyStartCoord, skyEndCoord, skyColor, this.renderBuffer);

        // Render floor
        const floorStartCoord = new Vector2D(0, this.renderBuffer.height / 2);
        const floorEndCoord = new Vector2D(this.renderBuffer.width, this.renderBuffer.height);
        const floorColor = new Color(0, 0, 0, 255);
        drawRect(floorStartCoord, floorEndCoord, floorColor, this.renderBuffer);
    }

    renderWalls = () => {
        const wallColor = new Color(255, 0, 0, 255);
        renderWallSegment(45, 120, 160, wallColor, this.renderBuffer);

        const lineStartCoord = new Vector2D(40, 160);
        const lineEndCoord = new Vector2D(50, 120);
        const lineColor = new Color(0, 0, 255, 255);
        drawLineDDA(lineStartCoord, lineEndCoord, lineColor, this.renderBuffer);
    }

}

// Rendering functions
function drawRect(startPos, endPos, color, renderBuffer) {
    for (let x = startPos.x; x <= endPos.x; x++) {
        for (let y = startPos.y; y <= endPos.y; y++) {
            renderBuffer.plotPixel(x, y, color);
        }
    }
}

function drawLineDDA(startPos, endPos, color, renderBuffer) {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;

    let steps;
    if (Math.abs(dx) > Math.abs(dy)) {
        steps = Math.abs(dx);
    } else {
        steps = Math.abs(dy);
    }

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = startPos.x;
    let y = startPos.y;

    //plot initial pixel
    renderBuffer.plotPixel(x, y, color);

    for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
        x += xIncrement;
        y += yIncrement;

        renderBuffer.plotPixel(Math.round(x), Math.round(y), color);
    }
}

function renderWallSegment(xPos, yStart, yEnd, color, renderBuffer) {
    drawLineDDA(new Vector2D(xPos, yStart), new Vector2D(xPos, yEnd), color, renderBuffer);
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