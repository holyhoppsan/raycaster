import {
    Vector2D
} from './vector2d.js';

import {
    drawLineDDA
} from './renderutils.js';

import {
    Color
} from './color.js';

class Level {
    constructor(gridSize) {
        this._grid = new Array(gridSize.x * gridSize.y).fill(0);
        this._gridSize = gridSize;
    }

    get gridSize() {
        return this._gridSize;
    }

    set gridSize(value) {
        this._gridSize = value;
    }

    render = (renderBuffer) => {
        const cellSize = 25;

        for (let x = 0; x < this.gridSize.x; x++) {
            const xPosition = x * cellSize;
            if (xPosition < renderBuffer.width) {
                drawLineDDA(new Vector2D(xPosition, 0), new Vector2D(xPosition, renderBuffer.height), new Color(0, 255, 0, 255), renderBuffer);
            }
        }

        for (let y = 0; y < this.gridSize.y; y++) {
            const yPosition = y * cellSize;
            if (yPosition < renderBuffer.height) {
                drawLineDDA(new Vector2D(0, yPosition), new Vector2D(renderBuffer.width, yPosition), new Color(0, 255, 0, 255), renderBuffer);
            }
        }
    }
}

export {
    Level
};