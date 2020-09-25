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
    constructor(gridSize, player) {
        this.grid = new Array(gridSize.x * gridSize.y).fill(0);
        this.gridSize = gridSize;
        this.player = player;
    }

    get gridSize() {
        return this._gridSize;
    }

    set gridSize(value) {
        this._gridSize = value;
    }

    get player() {
        return this._player;
    }

    set player(value) {
        this._player = value;
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

        this.renderPlayer(this.player.position, renderBuffer);
    }

    renderPlayer = (screenPosition, renderTarget) => {
        const playerColor = new Color(255, 0, 0, 255);
        const viewPlaneColor = new Color(0, 255, 0, 255);

        const extensionFactor = 20;
        const extendedVector = screenPosition.add(this.player.direction.mulScalar(extensionFactor));
        drawLineDDA(screenPosition, extendedVector, playerColor, renderTarget);

        const leftCameraPosition = screenPosition.add(this.player.direction.add(this.player.viewPlane).mulScalar(extensionFactor));
        drawLineDDA(screenPosition, leftCameraPosition, playerColor, renderTarget);

        const rightCameraPosition = screenPosition.add(this.player.direction.sub(this.player.viewPlane).mulScalar(extensionFactor));
        drawLineDDA(screenPosition, rightCameraPosition, playerColor, renderTarget);

        drawLineDDA(rightCameraPosition, leftCameraPosition, viewPlaneColor, renderTarget);

        renderTarget.plotPixel(screenPosition.x, screenPosition.y, playerColor);
    }
}

export {
    Level
};