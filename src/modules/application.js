import {
    keyCodes
} from './keyboardenum.js';

import {
    Vector2D
} from './vector2d.js';

import {
    Color
} from './color.js';

import {
    RenderBuffer
} from './renderutils.js'

import {
    Level
} from './level.js'

import {
    Player
} from './player.js'

import {
    PlayerController
} from './playercontroller.js'

import {
    MapView
} from './mapview.js'

import {
    RayCastView
} from './raycastview.js';

import {
    InputProcessor
} from './inputprocessor.js'

class Application {
    constructor() {
        this.frameDeltaComparisonEpsilon = 1;
        this.oneSecInMS = 1000;
        this.timeSinceLastTick = 0;
        this.previousTimeStampMs = 0;
        this.fpsInterval;
        this.renderBuffer = new RenderBuffer(document.getElementById("viewport"));

        this.inputProcessor = new InputProcessor();

        //Temporary game logic variables
        this.player = new Player(new Vector2D(100.0, 100.0), new Vector2D(1.0, 0.0), 90, 50.0, 1.0);
        this.level = new Level(new Vector2D(10, 10), this.player);
        this.playerController = new PlayerController(this.player, this.level, this.inputProcessor);

        this.mapViewEnabled = false;

        this.mapView = new MapView(this.player, this.level);
        this.rayCastView = new RayCastView(this.player, this.level, true);
    }

    init = (fps) => {
        this.fpsInterval = this.oneSecInMS / fps;
        this.previousTimeStampMs = 0;
        this.timeSinceLastTick = 0;
    }

    update = (timeStamp) => {
        const targetFrameRate = document.getElementById("framelimiter").value;
        this.fpsInterval = this.oneSecInMS / targetFrameRate;
        const frameRateIsUnbound = targetFrameRate == 0;

        let elapsedTimeMs = timeStamp - this.previousTimeStampMs;
        this.previousTimeStampMs = timeStamp;

        this.timeSinceLastTick += elapsedTimeMs;
        const timeSinceLastTickSeconds = this.timeSinceLastTick / this.oneSecInMS;

        if (frameRateIsUnbound || Math.abs(this.timeSinceLastTick - this.fpsInterval) < this.frameDeltaComparisonEpsilon || this.timeSinceLastTick > this.fpsInterval) {

            // Update game logic
            this.playerController.update(timeSinceLastTickSeconds);

            if (this.inputProcessor.currentKeyboardState[keyCodes.KEY_1]) {
                this.mapViewEnabled = !this.mapViewEnabled;
            }

            if (this.inputProcessor.currentKeyboardState[keyCodes.KEY_2]) {
                this.rayCastView.texturedMappingEnabled = !this.rayCastView.texturedMappingEnabled;
            }

            // Do rendering here.
            this.render(timeSinceLastTickSeconds);

            const currentFPS = this.oneSecInMS / this.timeSinceLastTick;

            document.getElementById("result").textContent = `Current fps = ${currentFPS}, current frame time = ${this.timeSinceLastTick} ms`;

            this.timeSinceLastTick = 0;
        }

        window.requestAnimationFrame(this.update);
    }

    render = (delta) => {
        this.renderBuffer.clear(new Color(0, 0, 0, 255));

        if (this.mapViewEnabled) {
            this.mapView.render(this.renderBuffer);
        } else {
            this.rayCastView.render(this.renderBuffer);
        }

        this.renderBuffer.applyImageData();
    }
}

export {
    Application
}
