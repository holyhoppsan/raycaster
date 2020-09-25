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
    RenderBuffer,
    drawRect,
    drawLineDDA,
    renderWallSegment
} from './modules/renderutils.js'

class Player {
    constructor(spawnPosition, spawnDirection, viewPlane, movementSpeed, rotationSpeed) {
        this.position = spawnPosition;
        this.direction = spawnDirection;
        this.viewPlane = viewPlane;
        this.movementSpeed = movementSpeed;
        this.rotationSpeed = rotationSpeed;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._direction = value;
    }

    get viewPlane() {
        return this._viewPlane;
    }

    set viewPlane(value) {
        this._viewPlane = value;
    }

    get movementSpeed() {
        return this._movementSpeed;
    }

    set movementSpeed(value) {
        this._movementSpeed = value;
    }

    get rotationSpeed() {
        return this._rotationSpeed;
    }

    set rotationSpeed(value) {
        this._rotationSpeed = value;
    }

    render = (renderTarget) => {
        const playerColor = new Color(255, 0, 0, 255);
        const viewPlaneColor = new Color(0, 255, 0, 255);

        const extensionFactor = 20;
        const extendedVector = this.position.add(this.direction.mulScalar(extensionFactor));
        drawLineDDA(this.position, extendedVector, playerColor, renderTarget);

        const leftCameraPosition = this.position.add(this.direction.add(this.viewPlane).mulScalar(extensionFactor));
        drawLineDDA(this.position, leftCameraPosition, playerColor, renderTarget);

        const rightCameraPosition = this.position.add(this.direction.sub(this.viewPlane).mulScalar(extensionFactor));
        drawLineDDA(this.position, rightCameraPosition, playerColor, renderTarget);

        drawLineDDA(rightCameraPosition, leftCameraPosition, viewPlaneColor, renderTarget);

        renderTarget.plotPixel(this.position.x, this.position.y, playerColor);
    }
}

class PlayerController {
    constructor(player) {
        this.player = player;
    }

    get player() {
        return this._player;
    }

    set player(value) {
        this._player = value;
    }
    currentKeyboardState = {};

    update = (deltaTime) => {
        if (this.currentKeyboardState[keyCodes.UP_ARROW]) {
            this.player.position.addEqual(this.player.direction.mulScalar(this.player.movementSpeed * deltaTime));
        }

        if (this.currentKeyboardState[keyCodes.DOWN_ARROW]) {
            this.player.position.addEqual(this.player.direction.mulScalar(-1.0).mulScalar(this.player.movementSpeed * deltaTime));
        }

        if (this.currentKeyboardState[keyCodes.LEFT_ARROW]) {
            this.player.direction.rotate2D(-this.player.rotationSpeed * deltaTime);
            this.player.viewPlane.rotate2D(-this.player.rotationSpeed * deltaTime);
        }

        if (this.currentKeyboardState[keyCodes.RIGHT_ARROW]) {
            this.player.direction.rotate2D(this.player.rotationSpeed * deltaTime);
            this.player.viewPlane.rotate2D(this.player.rotationSpeed * deltaTime);
        }
    }

    onKey = (event, keyCode, pressed) => {
        if (pressed) {
            this.currentKeyboardState[keyCode] = true;
            event.preventDefault();
        } else {
            this.currentKeyboardState[keyCode] = false;
            event.preventDefault();
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

        //Temporary game logic variables
        this.player = new Player(new Vector2D(100.0, 100.0), new Vector2D(-1.0, 0.0), new Vector2D(0.0, 0.66), 50.0, 1.0);
        this.playerController = new PlayerController(this.player);
    }

    init = (fps) => {
        this.fpsInterval = this.oneSecInMS / fps;
        this.previousTimeStampMs = 0;
        this.timeSinceLastTick = 0;

        // Register input events
        let boundOnKeyDown = (event) => {
            this.playerController.onKey(event, event.keyCode, true);
        };
        window.addEventListener('keydown', boundOnKeyDown, false);

        let boundOnKeyUp = (event) => {
            this.playerController.onKey(event, event.keyCode, false);
        };
        window.addEventListener('keyup', boundOnKeyUp, false);
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

            // Do rendering here.
            this.render(timeSinceLastTickSeconds);

            const currentFPS = this.oneSecInMS / this.timeSinceLastTick;

            document.getElementById("result").textContent = `Current fps = ${currentFPS}, current frame time = ${this.timeSinceLastTick} ms`;

            this.timeSinceLastTick = 0;
        }

        window.requestAnimationFrame(this.update);
    }

    render = (delta) => {
        this.renderBackground();

        this.renderWalls();

        this.player.render(this.renderBuffer);

        this.renderBuffer.applyImageData();
    }

    renderBackground = () => {
        // Render the sky
        const skyStartCoord = new Vector2D(0, 0);
        const skyEndCoord = new Vector2D(this.renderBuffer.width, this.renderBuffer.height / 2);
        const skyColor = new Color(135, 206, 250, 255);
        drawRect(skyStartCoord, skyEndCoord, skyColor, this.renderBuffer);

        // Render floor
        const floorStartCoord = new Vector2D(0, this.renderBuffer.height / 2);
        const floorEndCoord = new Vector2D(this.renderBuffer.width, this.renderBuffer.height);
        const floorColor = new Color(0, 0, 0, 255);
        drawRect(floorStartCoord, floorEndCoord, floorColor, this.renderBuffer);
    }

    renderWalls = () => {
        const wallColor = new Color(255, 0, 0, 255);
        renderWallSegment(45, 120, 160, wallColor, this.renderBuffer);

        const lineStartCoord = new Vector2D(40, 160);
        const lineEndCoord = new Vector2D(50, 120);
        const lineColor = new Color(0, 0, 255, 255);
        drawLineDDA(lineStartCoord, lineEndCoord, lineColor, this.renderBuffer);
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