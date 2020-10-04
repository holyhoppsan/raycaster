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

export {
    RenderBuffer,
    drawRect,
    drawLineDDA
}
