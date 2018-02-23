import api from './api.js'
import helper from './helper.js'
import router from "./router.js";

const content = {
    currentTrack: {
        artist: "",
        name: "",
        img: "",
        listeners: "",
        slug: "",
        tags: [],
    },
    directives: {
        img: {
            src: function(params) {
                return this.img;
            }
        }
    },
    trackList: [],
    // Get more info of the current track
    setCurrentTrack: function () {
        const self = this

        api.getTrackInfo(self.currentTrack.artist, self.currentTrack.name)
            .then(function (data) {

                if(!data.error) {
                    self.currentTrack.img = api.setImage(data.track)
                    self.currentTrack.tags = data.track.toptags.tag
                    self.currentTrack.listeners = data.track.listeners + " listeners"
                }

                self.renderCurrentTrack()
            })
            .catch(function (err) {
                router.error(err)
            })

        console.log();
    },
    // filter and manipulate the recent track data
    setRecentTracksData: function () {
        const self = this

        api.getRecentTracks()
            .then(function (data) {

                if(data.error) {
                    router.error(data.message)
                } else {
                    let tracks = data.recenttracks.track,
                        tracksWithIMG = []

                    // Set current track to first song of array
                    self.currentTrack.artist = data.recenttracks.track[0].artist["#text"]
                    self.currentTrack.name = data.recenttracks.track[0].name

                    self.setCurrentTrack()

                    // Remove first track of array
                    tracks.shift()

                    // Create array where only tracks with images exist
                    tracks = tracks.filter(api.filterByIMG)

                    // Create a clean array and put this in to the tracklist
                    tracks = tracks.map(api.createTrackObj)

                    // Reverse the trackList so the most recent song is first in list
                    self.trackList = tracks.reverse()


                    self.renderRecentTracks()
                    api.showPreloader(false)
                }

            })
            .catch(function (err) {
                router.error(err)
            })
    },
    // Render now playing text using transparencyjs
    renderCurrentTrack: function () {
        Transparency.render(document.getElementById('now-playing'), this.currentTrack, this.directives)
    },
    // Render recent tracks
    renderRecentTracks: function () {

        // Clear the list
        document.querySelector("#track-list").innerHTML = ""

        // Add 12 items of tracklist to html
        for(let i = 0; i < 12; i++) {

            let html = '<li><div><img src="' + this.trackList[i].imgSrc + '"><a href="#track/'+ this.trackList[i].slug + '">' + this.trackList[i].track + '</a></div></li>'
            document.querySelector("#track-list").insertAdjacentHTML('afterbegin', html)
        }
    }
}

export default content