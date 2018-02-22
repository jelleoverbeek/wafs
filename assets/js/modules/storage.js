const storage = {
    // Tracks array where the app can interact with
    tracks: [],
    // Method that returns true if there is a track with the same slug in localstorage
    trackExists: function(slug) {
        for(let i = 0; i < this.tracks.length; i++) {
            if(this.tracks[i].slug === slug) {
                return true
            }
        }
    },
    // Method that returns the index of a track
    getTrackIndex: function (slug) {
        for(let i = 0; i < this.tracks.length; i++) {
            if(this.tracks[i].slug === slug) {
                return i
            }
        }
    },
    // Method that adds similartracks to localstorage track
    addSimilarsToTrack: function (slug, similars) {
        if(this.trackExists(slug)) {
            let trackIndex = this.getTrackIndex(slug)
            this.tracks[trackIndex]["similar-tracks"] = similars
            this.store("tracks", this.tracks)
        }
    },
    // Add a track to localstorage
    addTrack: function (track) {
        if(!this.trackExists(track.slug)) {
            this.tracks.push(track)
            this.store("tracks", this.tracks)
        }
    },
    // Method to store data in localstorage
    store: function (name, data) {
        localStorage.setItem(name, JSON.stringify(data))
    },
    // Get data from localstorage
    get: function (name) {
        let data = localStorage.getItem(name)
        return JSON.parse(data)
    },
    // Gets data from the localstorage and adds it to the storage.tracks array
    init: function () {
        if(this.get("tracks")) {
            this.tracks = this.get("tracks")
        }
    }
}

export default storage