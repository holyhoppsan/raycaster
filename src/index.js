class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Callback when the window is loaded
window.onload = function () {
    const canvas = document.getElementById("viewport");
    const context = canvas.getContext("2d");

    const screenWidth = canvas.width;
    const screenHeight = canvas.height;

    const renderBuffer = context.createImageData(screenWidth, screenHeight);

    const frameDeltaComparisonEpsilon = 1;
    const oneSecInMS = 1000;

    let timeSinceLastTick = 0;
    let previousTimeStampMs = 0;
    let fpsInterval;

    function drawRect(xStart, yStart, xEnd, yEnd, r, g, b, a, imagedata) {
        const stride = 4;

        for (let x = xStart; x < xEnd; x++) {
            for (let y = yStart; y < yEnd; y++) {
                const pixelIndex = ((y * screenWidth) + x) * stride;

                imagedata.data[pixelIndex] = r;
                imagedata.data[pixelIndex + 1] = g;
                imagedata.data[pixelIndex + 2] = b;
                imagedata.data[pixelIndex + 3] = a;
            }
        }
    }

    function renderWallSegment(xPos, yStart, yEnd, r, g, b, a, imagedata) {
        const stride = 4;

        for (let y = yStart; y < yEnd; y++) {
            const pixelIndex = ((y * screenWidth) + xPos) * stride;

            imagedata.data[pixelIndex] = r;
            imagedata.data[pixelIndex + 1] = g;
            imagedata.data[pixelIndex + 2] = b;
            imagedata.data[pixelIndex + 3] = a;
        }
    }

    function render(delta) {
        renderBackground();

        renderWallSegment(45, 120, 160, 0, 128, 0, 255, renderBuffer);

        context.putImageData(renderBuffer, 0, 0);
    }

    function renderBackground() {
        // Render the sky
        drawRect(0, 0, screenWidth, screenHeight / 2, 135, 206, 250, 255, renderBuffer);

        // Render floor
        drawRect(0, screenHeight / 2, screenWidth, screenHeight, 0, 0, 0, 255, renderBuffer);
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