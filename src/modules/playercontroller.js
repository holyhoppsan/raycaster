import {
    keyCodes
} from './keyboardenum.js';

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

export {
    PlayerController
}