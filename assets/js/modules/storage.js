const storage = {
    tracks: [],
    trackExists: function(slug) {
        for(let i = 0; i < this.tracks.length; i++) {
            if(this.tracks[i].slug === slug) {
                return true
            }
        }
    },
    addTrack: function (track) {
        if(!this.trackExists(track.slug)) {
            this.tracks.push(track)
            this.store("tracks", this.tracks)
        }
    },
    store: function (name, data) {
        localStorage.setItem(name, JSON.stringify(data))
    },
    get: function (name) {
        let data = localStorage.getItem(name)
        return JSON.parse(data)
    },
    init: function () {
        if(this.get("tracks")) {
            this.tracks = this.get("tracks")
        }
    }
}

export default storage