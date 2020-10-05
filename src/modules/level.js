import {
    Vector2D
} from './vector2d.js';

class Level {
    cellSize = 25;

    constructor(gridSize) {
        this.grid = new Array(gridSize.x * gridSize.y).fill(0);

        // this.grid = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        //     1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        //     1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        //     1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        //     1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        //     1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        //     1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
        //     1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        //     1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        //     1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
        this.gridSize = gridSize;
    }

    get gridSize() {
        return this._gridSize;
    }

    set gridSize(value) {
        this._gridSize = value;
    }

    // generateLevelJsonForDownload() {
    //     const url = URL.createObjectURL(new Blob([JSON.stringify(this, null, 2)], {
    //         type: 'application/json'
    //     }));

    //     const link = document.createElement('a');

    //     link.href = url;
    //     link.innerText = "Download level json";

    //     document.body.appendChild(link);
    // };

    // readLevelFromFile(event) {
    //     var file = event.target.files[0];
    //     if (!file) {
    //         return;
    //     }
    //     let reader = new FileReader();
    //     reader.addEventListener('load', (loadEvent) => {
    //         try {
    //             let json = JSON.parse(loadEvent.target.result);
    //             let serializedObject = JSON.parse(json);
    //             Object.assign(this, serializedObject);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     });
    //     reader.readAsText(file);
    // }

    rayCast(rayDirection, player) {
        // convert player position into map square
        const playerLocationGridSpace = new Vector2D(player.position.x / this.cellSize, player.position.y / this.cellSize);
        const clampedplayerLocationGridSpace = new Vector2D(Math.floor(playerLocationGridSpace.x), Math.floor(playerLocationGridSpace.y));

        const deltaDistanceX = (rayDirection.y == 0) ? 0 : rayDirection.x == 0 ? 1 : Math.abs(1.0 / rayDirection.x);
        const deltaDistanceY = (rayDirection.x == 0) ? 0 : rayDirection.y == 0 ? 1 : Math.abs(1.0 / rayDirection.y);
        const deltaDistance = new Vector2D(deltaDistanceX, deltaDistanceY);

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
        let facingNorthOrSouth = false;
        while (hit != true) {
            if (rayCastDistance.x < rayCastDistance.y) {
                stepCounter.x += stepIncrement.x;
                rayCastDistance.x += deltaDistance.x;
                facingNorthOrSouth = false;
            } else {
                stepCounter.y += stepIncrement.y;
                rayCastDistance.y += deltaDistance.y;
                facingNorthOrSouth = true;
            }

            if (this.grid[stepCounter.y * this.gridSize.x + stepCounter.x] > 0) {
                hit = true;
            }
        }

        let perpendicularWallDistance = 0;
        if (facingNorthOrSouth == 0) {
            const gridDistance = ((stepCounter.x - playerLocationGridSpace.x) + (1 - stepIncrement.x) / 2);
            perpendicularWallDistance = (rayDirection.x == 0) ? gridDistance : gridDistance / rayDirection.x;
        } else {
            const gridDistance = ((stepCounter.y - playerLocationGridSpace.y) + (1 - stepIncrement.y) / 2);
            perpendicularWallDistance = (rayDirection.y == 0) ? gridDistance : gridDistance / rayDirection.y;
        }

        return {
            perpendicularWallDistance,
            facingNorthOrSouth
        };
    }
}

export {
    Level
};
