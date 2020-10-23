import {
    Vector2D
} from './vector2d.js'

test("Initialized properly after construction", () => {
    const vector = new Vector2D(255, 0);
    expect(vector.x).toBe(255);
    expect(vector.y).toBe(0);
});

test("Addition yields vector with correct values", () => {
    const vector = new Vector2D(255, 0);
    const resultVector = vector.add(new Vector2D(0, 255));

    expect(resultVector.x).toBe(255);
    expect(resultVector.y).toBe(255);
});

test("addEqual assigns vector with correct values", () => {
    let vector = new Vector2D(255, 0);
    vector.addEqual(new Vector2D(0, 255));

    expect(vector.x).toBe(255);
    expect(vector.y).toBe(255);
});

test("Subtraction yields vector with correct values", () => {
    const vector = new Vector2D(255, 0);
    const resultVector = vector.sub(new Vector2D(0, 255));

    expect(resultVector.x).toBe(255);
    expect(resultVector.y).toBe(-255);
});

test("subEqual assigns vector with correct values", () => {
    let vector = new Vector2D(255, 0);
    vector.subEqual(new Vector2D(0, 255));

    expect(vector.x).toBe(255);
    expect(vector.y).toBe(-255);
});

test("Multiplication yields vector with correct values", () => {
    const vector = new Vector2D(3, 6);
    const resultVector = vector.mul(new Vector2D(5, 2));

    expect(resultVector.x).toBe(15);
    expect(resultVector.y).toBe(12);
});

test("mulEqual assigns vector with correct values", () => {
    let vector = new Vector2D(3, 6);
    vector.mulEqual(new Vector2D(5, 2));

    expect(vector.x).toBe(15);
    expect(vector.y).toBe(12);
});

test("Multiplication with scalar yields vector with correct values", () => {
    const vector = new Vector2D(3, 6);
    const resultVector = vector.mulScalar(5);

    expect(resultVector.x).toBe(15);
    expect(resultVector.y).toBe(30);
});

test("mulScalarEqual assigns vector with correct values", () => {
    let vector = new Vector2D(3, 6);
    vector.mulScalarEqual(5);

    expect(vector.x).toBe(15);
    expect(vector.y).toBe(30);
});

test("Length yields correct results when given positive numbers", () => {
    const vector = new Vector2D(3, 4);

    expect(vector.length()).toBe(5);
});

test("Length yields correct results when given negative numbers", () => {
    const vector = new Vector2D(-3, -4);

    expect(vector.length()).toBe(5);
});

test("Rotation of unit vector handles positive angles correctly", () => {
    const sampleCount = 8;
    let unitvector = new Vector2D(1, 0);
    const rotationDelta = 2 * (Math.PI / sampleCount);

    const approxeq = (v1, v2, epsilon = 0.00001) => Math.abs(v1 - v2) <= epsilon;

    unitvector.rotate2D(0);
    expect(approxeq(unitvector.x, Math.cos(0))).toBe(true);
    expect(approxeq(unitvector.y, Math.sin(0))).toBe(true);

    for (let index = 1; index <= sampleCount; index++) {
        unitvector.rotate2D(rotationDelta);
        expect(approxeq(unitvector.x, Math.cos(index * rotationDelta))).toBe(true);
        expect(approxeq(unitvector.y, Math.sin(index * rotationDelta))).toBe(true);
    }
});

test("Rotation of unit vector handles positive negative correctly", () => {
    const sampleCount = 8;
    let unitvector = new Vector2D(1, 0);
    const rotationDelta = -2 * (Math.PI / sampleCount);

    const approxeq = (v1, v2, epsilon = 0.00001) => Math.abs(v1 - v2) <= epsilon;

    unitvector.rotate2D(0);
    expect(approxeq(unitvector.x, Math.cos(0))).toBe(true);
    expect(approxeq(unitvector.y, Math.sin(0))).toBe(true);

    for (let index = 1; index <= sampleCount; index++) {
        unitvector.rotate2D(rotationDelta);
        expect(approxeq(unitvector.x, Math.cos(index * rotationDelta))).toBe(true);
        expect(approxeq(unitvector.y, Math.sin(index * rotationDelta))).toBe(true);
    }
});
