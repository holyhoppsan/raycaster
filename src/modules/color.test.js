import {
    Color
} from './color.js'

test("Initialized properly after construction", () => {
    const color = new Color(255, 0, 255, 0);
    expect(color.r).toBe(255);
    expect(color.g).toBe(0);
    expect(color.b).toBe(255);
    expect(color.a).toBe(0);
});
