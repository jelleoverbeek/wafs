(function () {
    'use strict';

    var app = {
        init: function() {
            routes.init();
        }
    };

    var routes = {
        current: "",
        init: function() {
            var self = this;

            window.addEventListener("hashchange", function (event) {
                self.current = helper.getHashFromURL(event.newURL);
                sections.toggle(self.current);
            });

            this.current = helper.getHashFromURL(location.href);
            sections.toggle(this.current);
        }
    };

    var sections = {
        sections: function() {
            return document.querySelectorAll("section");
        },
        toggle: function (route) {

            this.sections().forEach(function(element) {
                element.classList.add("hidden");
            });

            document.querySelector(route).classList.remove("hidden");
        }
    };

    var helper = {
        getHashFromURL: function (url) {
            return "#" + url.split("#")[1];
        }
    };

    app.init();

}());
