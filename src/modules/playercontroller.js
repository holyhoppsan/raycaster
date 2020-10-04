import {
    keyCodes
} from './keyboardenum.js';

class PlayerController {
    constructor(player, level, inputProcessor) {
        this.player = player;
        this.level = level;
        this.inputProcessor = inputProcessor;
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

    get inputProcessor() {
        return this._inputProcessor;
    }

    set inputProcessor(value) {
        this._inputProcessor = value;
    }

    update = (deltaTime) => {
        if (this.inputProcessor.currentKeyboardState[keyCodes.KEY_W]) {
            this.player.position.addEqual(this.player.direction.mulScalar(this.player.movementSpeed * deltaTime));
        }

        if (this.inputProcessor.currentKeyboardState[keyCodes.KEY_S]) {
            this.player.position.addEqual(this.player.direction.mulScalar(-1.0).mulScalar(this.player.movementSpeed * deltaTime));
        }

        if (this.inputProcessor.currentKeyboardState[keyCodes.KEY_A]) {
            this.player.position.addEqual(this.player.viewPlane.mulScalar(-1.0).mulScalar(this.player.movementSpeed * deltaTime));
        }

        if (this.inputProcessor.currentKeyboardState[keyCodes.KEY_D]) {
            this.player.position.addEqual(this.player.viewPlane.mulScalar(this.player.movementSpeed * deltaTime));
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

export {
    PlayerController
}
