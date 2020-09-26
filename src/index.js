import {
    keyCodes
} from './modules/keyboardenum.js';

import {
    Vector2D
} from './modules/vector2d.js';

import {
    Color
} from './modules/color.js';

import {
    RenderBuffer
} from './modules/renderutils.js'

import {
    Level
} from './modules/level.js'

import {
    Player
} from './modules/player.js'

import {
    MapView
} from './modules/mapview.js'
import {
    RayCastView
} from './modules/raycastview.js';

import {
    InputProcessor
} from './modules/inputprocessor.js'

class PlayerController {
    constructor(player, inputProcessor) {
        this.player = player;
        this.inputProcessor = inputProcessor;
    }

    get player() {
        return this._player;
    }

    set player(value) {
        this._player = value;
    }

    get inputProcessor() {
        return this._inputProcessor;
    }

    set inputProcessor(value) {
        this._inputProcessor = value;
    }

    update = (deltaTime) => {
        if (this.inputProcessor.currentKeyboardState[keyCodes.UP_ARROW]) {
            this.player.position.addEqual(this.player.direction.mulScalar(this.player.movementSpeed * deltaTime));
        }

        if (this.inputProcessor.currentKeyboardState[keyCodes.DOWN_ARROW]) {
            this.player.position.addEqual(this.player.direction.mulScalar(-1.0).mulScalar(this.player.movementSpeed * deltaTime));
        }

        if (this.inputProcessor.currentKeyboardState[keyCodes.LEFT_ARROW]) {
            this.player.direction.rotate2D(-this.player.rotationSpeed * deltaTime);
            this.player.viewPlane.rotate2D(-this.player.rotationSpeed * deltaTime);
        }

        if (this.inputProcessor.currentKeyboardState[keyCodes.RIGHT_ARROW]) {
            this.player.direction.rotate2D(this.player.rotationSpeed * deltaTime);
            this.player.viewPlane.rotate2D(this.player.rotationSpeed * deltaTime);
        }
    }
}

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
        this.playerController = new PlayerController(this.player, this.inputProcessor);

        this.level = new Level(new Vector2D(10, 10), this.player);

        this.mapViewEnabled = false;

        this.mapView = new MapView(this.player, this.level);
        this.rayCastView = new RayCastView(this.player, this.level);
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

// Callback when the window is loaded
window.onload = function () {

    function main(tframe) {
        let app = new Application();
        app.init(30);
        app.update(0);
    }

    main(0);
}