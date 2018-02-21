import router from './modules/router.js'

(function () {
    "use strict"

    // General app object
    const app = {
        init: function() {
            if(!location.hash) {
                routie('now-playing')
            }
        }
    }

    app.init()

}())