class InputProcessor {
    currentKeyboardState = {};

    constructor() {
        // Register input events
        let boundOnKeyDown = (event) => {
            this.onKey(event, event.keyCode, true);
        };
        window.addEventListener('keydown', boundOnKeyDown, false);

        let boundOnKeyUp = (event) => {
            this.onKey(event, event.keyCode, false);
        };
        window.addEventListener('keyup', boundOnKeyUp, false);
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

export {
    InputProcessor
}
