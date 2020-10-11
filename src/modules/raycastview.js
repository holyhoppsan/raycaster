import {
    Vector2D
} from './vector2d.js';

import {
    drawLineDDA,
    drawRect,
    getPixelColorFromImage
} from './renderutils.js';

import {
    Color
} from './color.js';

class RayCastView {
    constructor(player, level) {
        this.player = player;
        this.level = level;

        this.wallTexture = document.getElementById("walltexture");
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.wallTexture.width;
        this.canvas.height = this.wallTexture.height;
        // document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.ctx.drawImage(this.wallTexture, 0, 0);
        this.wallImgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
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

        for (let x = 0; x < renderTarget.width; x += 1) {
            const rayStep = (2 * (x / renderTarget.width)) - 1;

            const scaledViewPlaneVector = this.player.viewPlane.mulScalar(rayStep);
            const rayDirection = this.player.direction.add(scaledViewPlaneVector);

            const rayResult = this.level.rayCast(rayDirection, this.player);

            const aspectRatio = renderTarget.width / renderTarget.height;
            const lineHeight = renderTarget.height / rayResult.perpendicularWallDistance / aspectRatio;

            const lineStart = new Vector2D(x, -lineHeight / 2 + renderTarget.height / 2);
            const lineEnd = new Vector2D(x, lineHeight / 2 + renderTarget.height / 2);

            // Read texture data
            const u = Math.floor(rayResult.wallSegmentIntersectionFactor * 64);
            let wallPixelColor = getPixelColorFromImage(u, 0, this.wallImgData);

            if (rayResult.facingNorthOrSouth) {
                wallPixelColor.r /= 2;
                wallPixelColor.g /= 2;
                wallPixelColor.b /= 2;
            }

            drawLineDDA(lineStart, lineEnd, wallPixelColor, renderTarget);
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
