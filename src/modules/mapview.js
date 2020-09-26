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

class MapView {
    constructor(player) {
        this.player = player;
    }

    get player() {
        return this._player;
    }

    set player(value) {
        this._player = value;
    }

    render = (renderTarget) => {
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
}

export {
    MapView
}