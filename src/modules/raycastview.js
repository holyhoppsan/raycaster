import {
    Vector2D
} from './vector2d.js';

import {
    drawLineDDA,
    drawLineDDATextured,
    drawRect,
    getPixelColorFromImage
} from './renderutils.js';

import {
    Color
} from './color.js';

class RayCastView {
    constructor(player, level, texturedMappingEnabled) {
        this.player = player;
        this.level = level;
        this.texturedMappingEnabled = texturedMappingEnabled;

        this.wallTexture = document.getElementById("walltexture");
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.wallTexture.width;
        this.canvas.height = this.wallTexture.height;
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

    get texturedMappingEnabled() {
        return this._textureMappingEnabled;
    }

    set texturedMappingEnabled(value) {
        this._textureMappingEnabled = value;
    }

    render = (renderTarget) => {

        this.renderBackground(renderTarget);

        //for (let x = 160; x < 161; x += 1) {
        for (let x = 0; x < renderTarget.width; x += 1) {
            const xRatio = x / renderTarget.width;
            const rayStep = (2 * (xRatio)) - 1;

            const scaledViewPlaneVector = this.player.viewPlane.mulScalar(rayStep);
            const rayDirection = this.player.direction.add(scaledViewPlaneVector);

            const rayResult = this.level.rayCast(rayDirection, this.player);

            const aspectRatio = renderTarget.width / renderTarget.height;
            const lineHeight = renderTarget.height / rayResult.perpendicularWallDistance / aspectRatio;

            const lineStart = new Vector2D(x, -lineHeight / 2 + renderTarget.height / 2);
            const lineEnd = new Vector2D(x, lineHeight / 2 + renderTarget.height / 2);

            if (this.texturedMappingEnabled == true) {
                // Read texture data
                const u = Math.floor(rayResult.wallSegmentIntersectionFactor * 64);
                const v = lineStart.y - renderTarget.height / 2 + lineHeight / 2;

                drawLineDDATextured(lineStart, lineEnd, new Vector2D(rayResult.wallSegmentIntersectionFactor, 0.0), new Vector2D(rayResult.wallSegmentIntersectionFactor, 1.0), this.wallImgData, renderTarget);
            } else {
                let wallPixelColor = new Color(0, 255, 0, 255);

                if (rayResult.facingNorthOrSouth) {
                    wallPixelColor.r /= 2;
                    wallPixelColor.g /= 2;
                    wallPixelColor.b /= 2;
                }

                drawLineDDA(lineStart, lineEnd, wallPixelColor, renderTarget);
            }
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
