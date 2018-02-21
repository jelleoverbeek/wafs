// Section functions
const sections = {
    // Return all the sections
    getSections: function() {
        return document.querySelectorAll("section")
    },
    // Hide all the sections
    hideSections: function () {
        this.getSections().forEach(function(element) {
            element.classList.add("hidden")
        })
    },
    // Hide all sections and show current section again
    toggle: function (route) {
        this.hideSections()
        document.querySelector(route).classList.remove("hidden")
    }
}

export default sections