// Callback when the window is loaded
window.onload = function () {
    const canvas = document.getElementById("viewport");
    const context = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const imagedata = context.createImageData(width, height);

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

    function main(tframe) {
        window.requestAnimationFrame(main);

        createImage();

        context.putImageData(imagedata, 0, 0);
    }

    main(0);
}