(function () {
    "use strict"

    // General app object
    var app = {
        init: function() {
            routes.init()
            nav.init()
        }
    }

    // Adding event listeners to a elements to prevent the default scroll behaviour
    var nav = {
        init: function () {
            document.querySelectorAll("nav a").forEach(function (element){
                element.addEventListener("click", function(event) {
                    event.preventDefault()
                    location.hash = this.hash
                })
            })
        }
    }

    // Routes object that handles URL changes
    var routes = {
        current: "",
        init: function() {
            var self = this

            window.addEventListener("hashchange", function (event) {
                self.current = location.hash
                sections.toggle(self.current)
            })

            // Check if page already has a hash when loading and set the current to it.
            if (location.hash) {
                this.current = location.hash
            } else {
                this.current = "#start"
            }

            sections.toggle(this.current)
        }
    }

    // Sections object with toggle function to show/hide sections
    var sections = {
        getSections: function() {
            return document.querySelectorAll("section")
        },
        toggle: function (route) {

            this.getSections().forEach(function(element) {
                element.classList.add("hidden")
            })

            document.querySelector(route).classList.remove("hidden")
        }
    }

    app.init()

}())
