(function () {
    "use strict";

    var app = {
        init: function() {
            routes.init();
            nav.init();
        }
    };

    var nav = {
        init: function () {
            document.querySelectorAll("nav a").forEach(function (element){
                element.addEventListener("click", function(event) {
                    event.preventDefault();
                    sections.toggle(this.hash);
                });
            })
        }
    };

    var routes = {
        current: "",
        init: function() {
            var self = this;

            window.addEventListener("hashchange", function (event) {
                self.current = location.hash;
                sections.toggle(self.current);
            });

            if (location.hash) {
                this.current = location.hash;
            } else {
                this.current = "#start";
            }

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

    app.init();

}());
