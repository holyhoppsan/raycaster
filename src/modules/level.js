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

class Level {
    cellSize = 25;

    constructor(gridSize, player) {
        //this.grid = new Array(gridSize.x * gridSize.y).fill(0);

        this.grid = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
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

    rayCast(rayDirection) {
        // convert player position into map square
        const playerLocationGridSpace = new Vector2D(this.player.position.x / this.cellSize, this.player.position.y / this.cellSize);
        const clampedplayerLocationGridSpace = new Vector2D(Math.floor(playerLocationGridSpace.x), Math.floor(playerLocationGridSpace.y));

        const deltaDistance = new Vector2D(rayDirection.x != 0.0 ? Math.abs(1.0 / rayDirection.x) : 0.0,
            rayDirection.y != 0.0 ? Math.abs(1.0 / rayDirection.y) : 0.0);

        let stepIncrement = new Vector2D(0, 0);
        let rayCastDistance = new Vector2D(0, 0);

        if (rayDirection.x < 0) {
            stepIncrement.x = -1;
            rayCastDistance.x += (playerLocationGridSpace.x - clampedplayerLocationGridSpace.x) * deltaDistance.x;
        } else {
            stepIncrement.x = 1;
            rayCastDistance.x += ((clampedplayerLocationGridSpace.x + 1) - playerLocationGridSpace.x) * deltaDistance.x;
        }

        if (rayDirection.y < 0) {
            stepIncrement.y = -1;
            rayCastDistance.y += (playerLocationGridSpace.y - clampedplayerLocationGridSpace.y) * deltaDistance.y;
        } else {
            stepIncrement.y = 1;
            rayCastDistance.y += ((clampedplayerLocationGridSpace.y + 1) - playerLocationGridSpace.y) * deltaDistance.y;
        }

        // traverse the ray direction
        let stepCounter = new Vector2D(clampedplayerLocationGridSpace.x, clampedplayerLocationGridSpace.y);
        let hit = false;
        let side = 0;
        while (hit != true) {
            if (rayCastDistance.x < rayCastDistance.y) {
                stepCounter.x += stepIncrement.x;
                rayCastDistance.x += deltaDistance.x;
                side = 0;
            } else {
                stepCounter.y += stepIncrement.y;
                rayCastDistance.y += deltaDistance.y;
                side = 1;
            }

            if (this.grid[stepCounter.y * this.gridSize.x + stepCounter.x] > 0) {
                hit = true;
            }
        }

        let perpendicularWallDistance = 0;
        if (side == 0) {
            const gridDistance = ((stepCounter.x - playerLocationGridSpace.x) + (1 - stepIncrement.x) / 2);
            perpendicularWallDistance = (rayDirection.x == 0) ? gridDistance : gridDistance / rayDirection.x;
        } else {
            const gridDistance = ((stepCounter.y - playerLocationGridSpace.y) + (1 - stepIncrement.y) / 2);
            perpendicularWallDistance = (rayDirection.y == 0) ? gridDistance : gridDistance / rayDirection.y;
        }

        return perpendicularWallDistance;
    }

    render = (renderBuffer) => {
        this.renderMapGrid(renderBuffer);

        this.renderPlayerViewEuclidean(renderBuffer);
    }

    renderRayEuclidean = (rayDirection, perpendicularWallDistance, renderTarget) => {
        const rayHitVector = rayDirection.mulScalar(perpendicularWallDistance);

        const rayWorldEnd = new Vector2D(renderTarget.width / 2.0, renderTarget.height / 2.0).add(rayHitVector.mulScalar(this.cellSize));
        const rayWorlStart = new Vector2D(renderTarget.width / 2.0, renderTarget.height / 2.0);
        drawLineDDA(rayWorlStart, rayWorldEnd, new Color(255, 255, 255, 255), renderTarget);
    }

    renderPlayerViewEuclidean(renderTarget) {
        for (let x = 0; x < renderTarget.width; x += 1) {
            const rayStep = (2 * (x / renderTarget.width)) - 1;

            const scaledViewPlaneVector = this.player.viewPlane.mulScalar(rayStep);
            const rayDirection = this.player.direction.add(scaledViewPlaneVector);

            const perpendicularWallDistance = this.rayCast(rayDirection);

            this.renderRayEuclidean(rayDirection, perpendicularWallDistance, renderTarget);
        }
    }

    renderMapGrid = (renderTarget) => {
        const mapScreenStartPositionX = (renderTarget.width / 2.0) - this.player.position.x;
        const mapScreenStartPositionY = (renderTarget.height / 2.0) - this.player.position.y;
        const mapScreenEndPositionX = (this.cellSize * this.gridSize.x) - this.player.position.x + (renderTarget.width / 2.0);
        const mapScreenEngPositionY = (this.cellSize * this.gridSize.y) - this.player.position.y + (renderTarget.height / 2.0);

        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                const xPosition = mapScreenStartPositionX + (x * this.cellSize);
                const yPosition = mapScreenStartPositionY + (y * this.cellSize);
                if (xPosition <= renderTarget.width && yPosition < renderTarget.height) {
                    if (this.grid[y * this.gridSize.x + x] > 0) {
                        drawRect(new Vector2D(xPosition, yPosition), new Vector2D(xPosition + this.cellSize, yPosition + this.cellSize), new Color(255, 255, 0, 255), renderTarget);
                    }
                }
            }
        }

        for (let x = 0; x < this.gridSize.x + 1; x++) {
            const xPosition = mapScreenStartPositionX + (x * this.cellSize);
            if (xPosition <= renderTarget.width) {
                drawLineDDA(new Vector2D(xPosition, mapScreenStartPositionY), new Vector2D(xPosition, mapScreenEngPositionY), new Color(0, 255, 0, 255), renderTarget);
            }
        }

        for (let y = 0; y < this.gridSize.y + 1; y++) {
            const yPosition = mapScreenStartPositionY + (y * this.cellSize);
            if (yPosition < renderTarget.height) {
                drawLineDDA(new Vector2D(mapScreenStartPositionX, yPosition), new Vector2D(mapScreenEndPositionX, yPosition), new Color(0, 255, 0, 255), renderTarget);
            }
        }
    }
}

export {
    Level
};