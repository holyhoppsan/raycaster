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
