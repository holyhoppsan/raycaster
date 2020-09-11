// Callback when the window is loaded
window.onload = function () {
    const canvas = document.getElementById("viewport");
    const context = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const imagedata = context.createImageData(width, height);

    const frameDeltaComparisonEpsilon = 1;
    const oneSecInMS = 1000;

    let timeSinceLastTick = 0;
    let previousTimeStampMs = 0;
    let fpsInterval;

    function updateImageData() {
        const stride = 4;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pixelIndex = ((y * width) + x) * stride;

                imagedata.data[pixelIndex] = 0;
                imagedata.data[pixelIndex + 1] = 255
                imagedata.data[pixelIndex + 2] = 0;
                imagedata.data[pixelIndex + 3] = 255
            }
        }
    }

    function render(delta) {
        updateImageData();

        context.putImageData(imagedata, 0, 0);
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