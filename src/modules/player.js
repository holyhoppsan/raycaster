import {
    Vector2D
} from './vector2d.js';

class Player {
    constructor(spawnPosition, spawnDirection, fieldOfView, movementSpeed, rotationSpeed) {
        this.position = spawnPosition;
        this.direction = spawnDirection;
        this.viewPlane = new Vector2D(0.0, Math.sin(fieldOfView * 2.0 * Math.PI / 180.0));
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
}

export {
    Player
};