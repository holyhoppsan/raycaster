import {
    Vector2D
} from './vector2d.js';
import {
    Color
} from './color.js';

class RenderBuffer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.stride = 4;

        this.imagedata = this.context.createImageData(canvas.width, canvas.height);

        this._pixelCount = 0;
    }

    resetPixelCount() {
        this._pixelCount = 0;
    }

    get pixelCount() {
        return this._pixelCount;
    }

    plotPixel(x, y, color) {
        const clampedX = Math.round(x);
        const clampedY = Math.round(y);
        if (clampedX >= 0 && clampedX < this.width && clampedY >= 0 && clampedY < this.height) {
            const pixelIndex = ((clampedY * this.imagedata.width) + clampedX) * this.stride;

            this.imagedata.data[pixelIndex] = color.r;
            this.imagedata.data[pixelIndex + 1] = color.g;
            this.imagedata.data[pixelIndex + 2] = color.b;
            this.imagedata.data[pixelIndex + 3] = color.a;

            this._pixelCount++;
        }
    }

    clear = (clearColor) => {
        for (let x = 0; x <= this.width; x++) {
            for (let y = 0; y <= this.height; y++) {
                this.plotPixel(x, y, clearColor);
            }
        }
    }

    applyImageData = () => {
        this.context.putImageData(this.imagedata, 0, 0);
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

        renderBuffer.plotPixel(x, y, color);
    }
}

function drawLineDDATextured(startPos, endPos, startTexCoord, endTexCoord, texture, renderBuffer) {
    if (startPos.y < 0 || endPos.y > renderBuffer.height) {
        console.log(`startPos x: ${startPos.x}, y: ${startPos.y} endPos x: ${endPos.x}, y: ${endPos.y}`);
    }

    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;

    const dTexX = endTexCoord.x - startTexCoord.x;
    const dTexY = endTexCoord.y - startTexCoord.y;

    let steps;
    if (Math.abs(dx) > Math.abs(dy)) {
        steps = Math.abs(dx);
    } else {
        steps = Math.abs(dy);
    }

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    const xTextureIncrement = dTexX / steps * texture.width;
    const yTextureIncrement = dTexY / steps * texture.height;
    const textureDimensions = new Vector2D(texture.width, texture.height);

    let x = startPos.x;
    let y = startPos.y;

    let textureSampleCoord = startTexCoord.mul(textureDimensions);

    let color = getPixelColorFromImage(textureSampleCoord.x, textureSampleCoord.y, texture);

    //plot initial pixel
    renderBuffer.plotPixel(x, y, color);

    for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
        x += xIncrement;
        y += yIncrement;

        textureSampleCoord.x += xTextureIncrement;
        textureSampleCoord.y += yTextureIncrement;

        color = getPixelColorFromImage(textureSampleCoord.x, textureSampleCoord.y, texture);
        renderBuffer.plotPixel(x, y, color);
    }
}

function getPixelColorFromImage(x, y, imageData) {
    const clampedX = Math.round(x);
    const clampedY = Math.round(y);
    const stride = 4;
    const pixelIndex = ((clampedY * imageData.width) + clampedX) * stride;

    return new Color(imageData.data[pixelIndex],
        imageData.data[pixelIndex + 1],
        imageData.data[pixelIndex + 2],
        imageData.data[pixelIndex + 3]);
}

export {
    RenderBuffer,
    drawRect,
    drawLineDDA,
    drawLineDDATextured,
    getPixelColorFromImage
}
