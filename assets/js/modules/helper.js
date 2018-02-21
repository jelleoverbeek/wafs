const helper = {
    // source: https://gist.github.com/mathewbyrne/1280286
    // Slugify niet naar apart router obj verplaatst omdat er ook een unslugify functie bijgekomen is en het anders heel verspreid staat.
    slugify: function (text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '')             // Trim - from end of text
    },
    unslugify: function (slug) {
        return slug.split("-").join(" ").split("+")
    }
}

export default helper;