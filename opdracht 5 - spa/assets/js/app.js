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
                    location.hash = this.hash;
                });
            });
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
              //waarom niet met een querySelectorAll en dan het eerste element nemen?
              //check voorbeeld (kan op meerdere manieren trouwens, dit is misschien een beetje een vieze maar kwam als eerste in mij op)
                this.current = '#' + document.querySelectorAll('section')[0].id;
                // this.current = "#start";
            }

            sections.toggle(this.current);
        }
    };

    var sections = {
        sections: function() {
            return document.querySelectorAll("section");
        },
        turnOff: function(elements){
          elements.forEach(function(element) {
              element.classList.add("hidden");
          });
        },
        toggle: function (route) {
            //mischien nog een sub function hierin?
            // Dan creeer je nog meer controle
            this.turnOff(this.sections());
            document.querySelector(route).classList.remove("hidden");
        }
    };

    app.init();

}());
