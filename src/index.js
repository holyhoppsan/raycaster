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

// Callback when the window is loaded
window.onload = function () {

    const renderBuffer = new RenderBuffer(document.getElementById("viewport"));

    const frameDeltaComparisonEpsilon = 1;
    const oneSecInMS = 1000;

    let timeSinceLastTick = 0;
    let previousTimeStampMs = 0;
    let fpsInterval;

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

    function render(delta) {
        renderBackground();

        renderWalls();

        renderBuffer.applyImageData();
    }

    function renderBackground() {
        // Render the sky
        drawRect(0, 0, renderBuffer.width, renderBuffer.height / 2, 135, 206, 250, 255, renderBuffer);

        // Render floor
        drawRect(0, renderBuffer.height / 2, renderBuffer.width, renderBuffer.height, 0, 0, 0, 255, renderBuffer);
    }

    function renderWalls() {
        renderWallSegment(45, 120, 160, 0, 128, 0, 255, renderBuffer);
    }

    function init(fps) {
        fpsInterval = oneSecInMS / fps;
        previousTimeStampMs = 0;
        timeSinceLastTick = 0;
    }

    function update(timeStamp) {
        const targetFrameRate = document.getElementById("framelimiter").value;
        fpsInterval = oneSecInMS / targetFrameRate;
        const frameRateIsUnbound = targetFrameRate == 0;

        let elapsedTimeMs = timeStamp - previousTimeStampMs;
        previousTimeStampMs = timeStamp;

        timeSinceLastTick += elapsedTimeMs;

        if (frameRateIsUnbound || Math.abs(timeSinceLastTick - fpsInterval) < frameDeltaComparisonEpsilon || timeSinceLastTick > fpsInterval) {

            //do rendering here.
            render(timeSinceLastTick);

            const currentFPS = oneSecInMS / timeSinceLastTick;

            document.getElementById("result").textContent = `Current fps = ${currentFPS}, current frame time = ${timeSinceLastTick} ms`;

            timeSinceLastTick = 0;
        }

        window.requestAnimationFrame(update);
    }

    function main(tframe) {
        init(30);
        update(0);
    }

    main(0);
}