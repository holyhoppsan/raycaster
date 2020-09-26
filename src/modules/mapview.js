import {
    Vector2D
} from './vector2d.js';

import {
    drawLineDDA,
    drawRect
} from './renderutils.js';

import {
    Color
} from './color.js';

import {
    Player
} from './player.js'

import {
    Level
} from './level.js'

class MapView {
    constructor(player, level) {
        this.player = player;
        this.level = level;
    }

    get player() {
        return this._player;
    }

    set player(value) {
        this._player = value;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }

    render = (renderTarget) => {

        this.renderPlayerViewEuclidean(renderTarget);

        this.renderMapGrid(renderTarget);

        this.renderPlayer(new Vector2D(renderTarget.width / 2, renderTarget.height / 2), renderTarget);
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


    renderRayEuclidean = (rayDirection, perpendicularWallDistance, renderTarget) => {
        const rayHitVector = rayDirection.mulScalar(perpendicularWallDistance);

        const rayWorldEnd = new Vector2D(renderTarget.width / 2.0, renderTarget.height / 2.0).add(rayHitVector.mulScalar(this.level.cellSize));
        const rayWorlStart = new Vector2D(renderTarget.width / 2.0, renderTarget.height / 2.0);
        drawLineDDA(rayWorlStart, rayWorldEnd, new Color(255, 255, 255, 255), renderTarget);
    }

    renderPlayerViewEuclidean(renderTarget) {
        for (let x = 0; x < renderTarget.width; x += 1) {
            const rayStep = (2 * (x / renderTarget.width)) - 1;

            const scaledViewPlaneVector = this.player.viewPlane.mulScalar(rayStep);
            const rayDirection = this.player.direction.add(scaledViewPlaneVector);

            const rayResult = this.level.rayCast(rayDirection);

            this.renderRayEuclidean(rayDirection, rayResult.perpendicularWallDistance, renderTarget);
        }
    }

    renderMapGrid = (renderTarget) => {
        const mapScreenStartPositionX = (renderTarget.width / 2.0) - this.player.position.x;
        const mapScreenStartPositionY = (renderTarget.height / 2.0) - this.player.position.y;
        const mapScreenEndPositionX = (this.level.cellSize * this.level.gridSize.x) - this.player.position.x + (renderTarget.width / 2.0);
        const mapScreenEngPositionY = (this.level.cellSize * this.level.gridSize.y) - this.player.position.y + (renderTarget.height / 2.0);

        for (let x = 0; x < this.level.gridSize.x; x++) {
            for (let y = 0; y < this.level.gridSize.y; y++) {
                const xPosition = mapScreenStartPositionX + (x * this.level.cellSize);
                const yPosition = mapScreenStartPositionY + (y * this.level.cellSize);
                if (xPosition <= renderTarget.width && yPosition < renderTarget.height) {
                    if (this.level.grid[y * this.level.gridSize.x + x] > 0) {
                        drawRect(new Vector2D(xPosition, yPosition), new Vector2D(xPosition + this.level.cellSize, yPosition + this.level.cellSize), new Color(255, 255, 0, 255), renderTarget);
                    }
                }
            }
        }

        for (let x = 0; x < this.level.gridSize.x + 1; x++) {
            const xPosition = mapScreenStartPositionX + (x * this.level.cellSize);
            if (xPosition <= renderTarget.width) {
                drawLineDDA(new Vector2D(xPosition, mapScreenStartPositionY), new Vector2D(xPosition, mapScreenEngPositionY), new Color(0, 255, 0, 255), renderTarget);
            }
        }

        for (let y = 0; y < this.level.gridSize.y + 1; y++) {
            const yPosition = mapScreenStartPositionY + (y * this.level.cellSize);
            if (yPosition < renderTarget.height) {
                drawLineDDA(new Vector2D(mapScreenStartPositionX, yPosition), new Vector2D(mapScreenEndPositionX, yPosition), new Color(0, 255, 0, 255), renderTarget);
            }
        }
    }
}

export {
    MapView
}