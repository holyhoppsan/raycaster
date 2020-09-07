// Callback when the window is loaded
window.onload = function () {
    const canvas = document.getElementById("viewport");
    const context = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const imagedata = context.createImageData(width, height);

    let frameCount = 0;
    let fps, fpsInterval, startTime, then, elapsed;

    function createImage() {
        const stride = 4;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pixelIndex = ((y * width) + x) * 4;

                imagedata.data[pixelIndex] = 0;
                imagedata.data[pixelIndex + 1] = 255
                imagedata.data[pixelIndex + 2] = 0;
                imagedata.data[pixelIndex + 3] = 255
            }
        }
    }

    function update(delta) {
        createImage();

        context.putImageData(imagedata, 0, 0);
    }

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        console.log(startTime);
        animate();
    }

    function animate() {
        setTimeout(() => {
            window.requestAnimationFrame(animate);
            now = Date.now();
            let sinceStart = now - startTime;
            let currentFPS = Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
            const elapsedTime = Math.round((sinceStart / 1000) * 100) / 100;
            document.getElementById("result").textContent = `Elapsed time = ${elapsedTime} secs, current fps = ${currentFPS}`;
        }, fpsInterval);
    }

    function main(tframe) {
        //window.requestAnimationFrame(update);
        startAnimating(5);
    }

    main(0);
}