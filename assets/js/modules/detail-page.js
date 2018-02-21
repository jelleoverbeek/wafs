import helper from './helper.js'
import api from './api.js'

const detailPage = {
    container: document.querySelector("#track"),
    content: {
        tags: [],
        "similar-tracks": []
    },
    trackInfoLoading: false,
    similarTracksLoading: false,
    // Clean the detail page
    cleanContent: function () {
        document.querySelector("#no-similar-tracks").classList.add("hidden");
        document.querySelector("#similar-tracks").innerHTML = "";
    },
    // Render main detail content
    renderMain: function () {
        // TODO img via transparency inladen
        if(this.content.img) {
            this.container.querySelector("img").src = this.content.img
        }

        Transparency.render(document.getElementById('track'), this.content)
    },
    // Render similar tracks data
    renderSimilar: function () {
        this.content["similar-tracks"].forEach(function (item) {
            let html = '<li><div><img src="' + item.imgSrc + '"><a href="#track/'+ item.slug + '">' + item.track + '</a></div></li>'
            document.querySelector("#similar-tracks").insertAdjacentHTML('afterbegin', html)
        })
    },
    // If both the trackInfo and SimilarTracks API calls are done hide the preloader.
    checkLoading: function () {
        if(!this.trackInfoLoading && !this.similarTracksLoading) {
            api.showPreloader(false)
        }
    },
    // Populate the this.content obj
    setContent: function (track) {
        const self = this

        api.getTrackInfo(track[0], track[1])
            .then(function (data) {

                if(data.error) {
                    document.querySelector("#error h2").textContent = data.message
                    routie('error');
                } else {
                    self.content.artist = data.track.artist.name
                    self.content.name = data.track.name
                    self.content.tags = data.track.toptags.tag
                    self.content.listeners = data.track.listeners

                    if(data.track.album && data.track.album.image[3]["#text"]) {
                        self.content.img = data.track.album.image[3]["#text"]
                    } else {
                        self.content.img = "assets/img/albumart.svg"
                    }

                    self.renderMain()
                }

                self.trackInfoLoading = false;
                self.checkLoading()
            })
            .catch(function (err) {
                console.error(err)
                api.showPreloader(false)
            })

        api.getSimilarTracks(track[0], track[1])
            .then(function (data) {

                if(!data.similartracks.track.length) {
                    document.querySelector("#no-similar-tracks").classList.remove("hidden");
                } else {
                    const tracks = data.similartracks.track.filter(api.filterByIMG)
                    self.content["similar-tracks"] = tracks.map(api.createTrackObj)
                    self.renderSimilar()
                }

                self.similarTracksLoading = false;
                self.checkLoading()
            })
            .catch(function (err) {
                console.error(err)
                api.showPreloader(false)
            })
    },
    init: function (slug) {
        this.cleanContent()
        this.setContent(helper.unslugify(slug))
    }
}

export default detailPage