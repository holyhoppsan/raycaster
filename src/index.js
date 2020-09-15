var enums = {};
enums.keyboard = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    INSERT: 45,
    DELETE: 46,
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,
    KEY_A: 65,
    KEY_B: 66,
    KEY_C: 67,
    KEY_D: 68,
    KEY_E: 69,
    KEY_F: 70,
    KEY_G: 71,
    KEY_H: 72,
    KEY_I: 73,
    KEY_J: 74,
    KEY_K: 75,
    KEY_L: 76,
    KEY_M: 77,
    KEY_N: 78,
    KEY_O: 79,
    KEY_P: 80,
    KEY_Q: 81,
    KEY_R: 82,
    KEY_S: 83,
    KEY_T: 84,
    KEY_U: 85,
    KEY_V: 86,
    KEY_W: 87,
    KEY_X: 88,
    KEY_Y: 89,
    KEY_Z: 90,
    LEFT_META: 91,
    RIGHT_META: 92,
    SELECT: 93,
    NUMPAD_0: 96,
    NUMPAD_1: 97,
    NUMPAD_2: 98,
    NUMPAD_3: 99,
    NUMPAD_4: 100,
    NUMPAD_5: 101,
    NUMPAD_6: 102,
    NUMPAD_7: 103,
    NUMPAD_8: 104,
    NUMPAD_9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    SEMICOLON: 186,
    EQUALS: 187,
    COMMA: 188,
    DASH: 189,
    PERIOD: 190,
    FORWARD_SLASH: 191,
    GRAVE_ACCENT: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    SINGLE_QUOTE: 222
};

// Class definitions
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    add(value) {
        const newVector = new Vector2D(this.x, this.y);
        newVector.x += value.x;
        newVector.y += value.y;
        return newVector;
    }

    addEqual(value) {
        this.x += value.x;
        this.y += value.y;
    }

    sub(value) {
        const newVector = new Vector2D(this.x, this.y);
        newVector.x -= value.x;
        newVector.y -= value.y;
        return newVector;
    }

    subEqual(value) {
        this.x -= value.x;
        this.y -= value.y;
    }

    mul(value) {
        const newVector = new Vector2D(this.x, this.y);
        newVector.x *= value.x;
        newVector.y *= value.y;
        return newVector;
    }

    mulScalar(scalar) {
        const newVector = new Vector2D(this.x, this.y);
        newVector.x *= scalar;
        newVector.y *= scalar;
        return newVector;
    }

    mulEqual(value) {
        this.x *= value.x;
        this.y *= value.y;
    }

    mulScalarEqual(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
}

class Color {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

class RenderBuffer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.stride = 4;

        this.imagedata = this.context.createImageData(canvas.width, canvas.height);
    }

    plotPixel(x, y, color) {
        const pixelIndex = ((y * this.imagedata.width) + x) * this.stride;

        this.imagedata.data[pixelIndex] = color.r;
        this.imagedata.data[pixelIndex + 1] = color.g;
        this.imagedata.data[pixelIndex + 2] = color.b;
        this.imagedata.data[pixelIndex + 3] = color.a;
    }


    applyImageData = () => {
        this.context.putImageData(this.imagedata, 0, 0);
    }
}

class Player {
    constructor(spawnPosition, spawnDirection) {
        this.position = spawnPosition;
        this.direction = spawnDirection;
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
        this.player = new Player(new Vector2D(100.0, 100.0), new Vector2D(-1.0, 0.0));
        this.viewPlane = new Vector2D(0.0, 0.66);
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

        if (frameRateIsUnbound || Math.abs(this.timeSinceLastTick - this.fpsInterval) < this.frameDeltaComparisonEpsilon || this.timeSinceLastTick > this.fpsInterval) {

            // Update game logic
            this.renderPlayer();

            // Do rendering here.
            this.render(this.timeSinceLastTick);

            const currentFPS = this.oneSecInMS / this.timeSinceLastTick;

            document.getElementById("result").textContent = `Current fps = ${currentFPS}, current frame time = ${this.timeSinceLastTick} ms`;

            this.timeSinceLastTick = 0;
        }

        window.requestAnimationFrame(this.update);
    }

    renderPlayer = () => {
        const playerColor = new Color(255, 0, 0, 255);
        const viewPlaneColor = new Color(0, 255, 0, 255);

        const extensionFactor = 20;
        const extendedVector = this.player.position.add(this.player.direction.mulScalar(extensionFactor));
        drawLineDDA(this.player.position, extendedVector, playerColor, this.renderBuffer);

        const leftCameraPosition = this.player.position.add(this.player.direction.add(this.viewPlane).mulScalar(extensionFactor));
        drawLineDDA(this.player.position, leftCameraPosition, playerColor, this.renderBuffer);

        const rightCameraPosition = this.player.position.add(this.player.direction.sub(this.viewPlane).mulScalar(extensionFactor));
        drawLineDDA(this.player.position, rightCameraPosition, playerColor, this.renderBuffer);

        drawLineDDA(rightCameraPosition, leftCameraPosition, viewPlaneColor, this.renderBuffer);

        this.renderBuffer.plotPixel(this.player.position.x, this.player.position.y, playerColor);
    }

    render = (delta) => {
        this.renderBackground();

        this.renderWalls();

        this.renderPlayer();

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

    onKey = (event, keyCode, pressed) => {
        switch (keyCode) {
            case enums.keyboard.UP_ARROW: {
                this.player.position.addEqual(this.player.direction);
                event.preventDefault();
                break;
            }

            case enums.keyboard.DOWN_ARROW: {
                this.player.position.addEqual(this.player.direction.mulScalar(-1.0));
                event.preventDefault();
                break;
            }

            case enums.keyboard.LEFT_ARROW: {
                this.player.position.addEqual(this.player.direction);
                event.preventDefault();
                break;
            }

            case enums.keyboard.RIGHT_ARROW: {
                this.player.position.addEqual(this.player.direction.mulScalar(-1.0));
                event.preventDefault();
                break;
            }
        }
    }

}

// Rendering functions
function drawRect(startPos, endPos, color, renderBuffer) {
    for (let x = startPos.x; x <= endPos.x; x++) {
        for (let y = startPos.y; y <= endPos.y; y++) {
            renderBuffer.plotPixel(x, y, color);
        }
    }
}

function drawLineDDA(startPos, endPos, color, renderBuffer) {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;

    let steps;
    if (Math.abs(dx) > Math.abs(dy)) {
        steps = Math.abs(dx);
    } else {
        steps = Math.abs(dy);
    }

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = startPos.x;
    let y = startPos.y;

    //plot initial pixel
    renderBuffer.plotPixel(Math.round(x), Math.round(y), color);

    for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
        x += xIncrement;
        y += yIncrement;

        renderBuffer.plotPixel(Math.round(x), Math.round(y), color);
    }
}

function renderWallSegment(xPos, yStart, yEnd, color, renderBuffer) {
    drawLineDDA(new Vector2D(xPos, yStart), new Vector2D(xPos, yEnd), color, renderBuffer);
}

// Callback when the window is loaded
window.onload = function () {

    function main(tframe) {
        let app = new Application();

        // Register input events
        window.addEventListener('keydown', function (event) {
            app.onKey(event, event.keyCode, true);
        }, false);
        window.addEventListener('keyup', function (event) {
            app.onKey(event, event.keyCode, false);
        }, false);

        app.init(30);
        app.update(0);
    }

    main(0);
}