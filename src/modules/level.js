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
        const cellWidth = 25;

        for (let x = 0; x < this.gridSize.x; x++) {
            const xPosition = x * cellWidth;
            if (xPosition < renderBuffer.width) {
                drawLineDDA(new Vector2D(xPosition, 0), new Vector2D(xPosition, renderBuffer.height), new Color(0, 255, 0, 255), renderBuffer);
            }
        }
    }
}

export {
    Level
};