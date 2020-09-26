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

    rotate2D(radian) {
        const cachedXValue = this.x;
        this.x = cachedXValue * Math.cos(radian) - this.y * Math.sin(radian);
        this.y = cachedXValue * Math.sin(radian) + this.y * Math.cos(radian);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}

export {
    Vector2D
};