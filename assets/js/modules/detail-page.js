import helper from './helper.js'
import api from './api.js'
import storage from './storage.js'
import router from "./router.js";

const detailPage = {
    container: document.querySelector("#track"),
    content: {
        tags: [],
        "similar-tracks": []
    },
    trackInfoLoading: false,
    similarTracksLoading: false,
    // Clean the detail page
    clearContent: function () {

        this.content = {
            tags: [],
            "similar-tracks": []
        }

        this.renderMain()
        this.renderSimilar()

        document.querySelector("#no-similar-tracks").classList.add("hidden");
    },
    // Render main detail content
    renderMain: function () {

        if(this.content.img) {
            this.container.querySelector("img").src = this.content.img
        }

        Transparency.render(document.getElementById('track'), this.content)
    },
    // Render similar tracks data
    renderSimilar: function () {
        const tracksEl = document.querySelector("#similar-tracks");
        tracksEl.innerHTML = "";

        this.content["similar-tracks"].forEach(function (item) {
            let html = '<li><div><img src="' + item.imgSrc + '"><a href="#track/'+ item.slug + '">' + item.track + '</a></div></li>'
            tracksEl.insertAdjacentHTML('afterbegin', html)
        })
    },
    // If both the trackInfo and SimilarTracks API calls are done hide the preloader.
    checkLoading: function () {
        if(!this.trackInfoLoading && !this.similarTracksLoading) {
            api.showPreloader(false)
        }
    },
    // Populate the this.content obj
    setContent: function (slug) {
        const self = this
        let track = helper.unslugify(slug)

        // Clean the content of the detail page so it doesn't mix up
        this.clearContent()

        // Gets data from localstorage and puts it in memory
        storage.init()

        // Load track from storage instead of the api
        if(storage.trackExists(slug)) {
            let track = storage.tracks[storage.getTrackIndex(slug)]

            // Set the content object
            this.content.artist = track.artist
            this.content.name = track.name
            this.content.slug =  track.slug
            this.content.tags = track.tags
            this.content.listeners = track.listeners
            this.content.img = track.img
            this.content["similar-tracks"] = track["similar-tracks"]

            this.renderMain()
            this.renderSimilar()
            api.showPreloader(false)

        } else {
            api.getTrackInfo(track[0], track[1])
                .then(function (data) {

                    // If error send user to error page and show the error message
                    if(data.error) {
                        router.error(data.message)
                    } else {

                        // Set the content object
                        self.content.artist = data.track.artist.name
                        self.content.name = data.track.name
                        self.content.slug =  helper.slugify(data.track.artist.name) + '+' + helper.slugify(data.track.name)
                        self.content.tags = data.track.toptags.tag
                        self.content.listeners = data.track.listeners
                        self.content.img = api.setImage(data.track)

                        storage.addTrack(self.content);
                        self.renderMain()
                    }

                    self.trackInfoLoading = false;
                    self.checkLoading()
                })
                .catch(function (err) {
                    console.error(err)
                    router.error(err)
                })

            api.getSimilarTracks(track[0], track[1])
                .then(function (data) {

                    // Check if there are any similar tracks found, if not show this to the user
                    if(data.error || !data.similartracks.track.length) {
                        document.querySelector("#no-similar-tracks").classList.remove("hidden");
                    } else {

                        // filter tracks
                        const tracks = data.similartracks.track.filter(api.filterByIMG)
                        self.content["similar-tracks"] = tracks.map(api.createTrackObj)

                        // Add similar tracks to localstorage track
                        storage.addSimilarsToTrack(slug, self.content["similar-tracks"])
                        self.renderSimilar()
                    }

                    self.similarTracksLoading = false;
                    self.checkLoading()
                })
                .catch(function (err) {
                    console.error(err)
                    router.error(err)
                })
        }
    },
    init: function (slug) {
        this.clearContent()
        this.setContent(slug)
    }
}

export default detailPage