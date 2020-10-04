import {
    Application
} from './modules/application.js'

// Callback when the window is loaded
window.onload = function () {

    function main(tframe) {
        let app = new Application();
        app.init(30);
        app.update(0);
    }

    main(0);
}
