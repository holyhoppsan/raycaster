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

class RayCastView {
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

        this.renderBackground(renderTarget);

        // for (let x = 160; x < 161 /*renderTarget.width*/ ; x += 1) {
        for (let x = 0; x < renderTarget.width; x += 1) {
            const rayStep = (2 * (x / renderTarget.width)) - 1;

            const scaledViewPlaneVector = this.player.viewPlane.mulScalar(rayStep);
            const rayDirection = this.player.direction.add(scaledViewPlaneVector);

            const rayResult = this.level.rayCast(rayDirection);

            const aspectRatio = renderTarget.width / renderTarget.height;
            const lineHeight = renderTarget.height / rayResult.perpendicularWallDistance / aspectRatio;

            const lineStart = new Vector2D(x, -lineHeight / 2 + renderTarget.height / 2);
            const lineEnd = new Vector2D(x, lineHeight / 2 + renderTarget.height / 2);

            const color = new Color(0, rayResult.facingNorthOrSouth ? 255 / 2 : 255, 0, 255);

            drawLineDDA(lineStart, lineEnd, color, renderTarget);
        }
    }

    renderBackground = (renderTarget) => {
        // Render the sky
        const skyStartCoord = new Vector2D(0, 0);
        const skyEndCoord = new Vector2D(renderTarget.width, renderTarget.height / 2);
        const skyColor = new Color(135, 206, 250, 255);
        drawRect(skyStartCoord, skyEndCoord, skyColor, renderTarget);
    }
}

export {
    RayCastView
}