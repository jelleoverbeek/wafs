import api from './api.js'
import helper from './helper.js'

const content = {
    "current-track": "",
    trackList: [],
    // Manipulate recieved track data
    setRecentTracksData: function () {
        var self = this

        api.getRecentTracks()
            .then(function (data) {
                var tracks = data.recenttracks.track,
                    tracksWithIMG = []

                // Set current track to first song of array
                content["current-track"] = data.recenttracks.track[0].artist["#text"] + " - " + data.recenttracks.track[0].name

                // Remove first track of array
                tracks.shift()

                // Create new array where only tracks with images exist
                tracksWithIMG = tracks.filter(api.filterByIMG)

                // Create a clean array and put this in to the tracklist
                content.trackList = tracksWithIMG.map(api.createTrackObj)

                self.render()
                api.showPreloader(false)
            })
            .catch(function (err) {
                routie('error')
                console.error(err)
            })
    },
    render: function () {
        // Render now playing text using transparencyjs
        Transparency.render(document.getElementById('now-playing'), this)

        document.querySelector("#track-list").innerHTML = ""

        // Add 12 items of tracklist to html
        for(var i = 0; i < 12; i++) {
            var html = '<li><div><img src="' + this.trackList[i].imgSrc + '"><a href="#track/'+ this.trackList[i].slug + '">' + this.trackList[i].track + '</a></div></li>'
            document.querySelector("#track-list").insertAdjacentHTML('afterbegin', html)
        }
    }
}

export default content