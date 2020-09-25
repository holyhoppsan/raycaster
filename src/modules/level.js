import {
    Vector2D
} from './vector2d.js';

import {
    drawLineDDA
} from './renderutils.js';

import {
    Color
} from './color.js';

import {
    Player
} from './player.js'

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

        const mapScreenStartPositionX = (renderBuffer.width / 2.0) - this.player.position.x;
        const mapScreenStartPositionY = (renderBuffer.height / 2.0) - this.player.position.y;
        const mapScreenEndPositionX = (cellSize * this.gridSize.x) - this.player.position.x + (renderBuffer.width / 2.0);
        const mapScreenEngPositionY = (cellSize * this.gridSize.y) - this.player.position.y + (renderBuffer.height / 2.0);

        for (let x = 0; x < this.gridSize.x + 1; x++) {
            const xPosition = mapScreenStartPositionX + (x * cellSize);
            if (xPosition <= renderBuffer.width) {
                drawLineDDA(new Vector2D(xPosition, mapScreenStartPositionY), new Vector2D(xPosition, mapScreenEngPositionY), new Color(0, 255, 0, 255), renderBuffer);
            }
        }

        for (let y = 0; y < this.gridSize.y + 1; y++) {
            const yPosition = mapScreenStartPositionY + (y * cellSize);
            if (yPosition < renderBuffer.height) {
                drawLineDDA(new Vector2D(mapScreenStartPositionX, yPosition), new Vector2D(mapScreenEndPositionX, yPosition), new Color(0, 255, 0, 255), renderBuffer);
            }
        }

        this.renderPlayer(new Vector2D(renderBuffer.width / 2, renderBuffer.height / 2), renderBuffer);
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