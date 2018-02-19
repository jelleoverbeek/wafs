(function () {
    "use strict"

    // General app object
    var app = {
        init: function() {
            if(!location.hash) {
                routie('now-playing')
            }
        }
    }

    // Object with content en render functions
    var content = {
        "current-track": "",
        trackList: [],
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

    // Api functions
    var api = {
        // Last fm user
        user: "jelleoverbeek",
        // return format of API (JSON/XML)
        format: "json",
        baseURL: "https://ws.audioscrobbler.com/2.0/",
        // Filter array by images that have an image,
        showPreloader: function (loading) {
            var preloader = document.querySelector(".preloader")

            if(loading) {
                preloader.classList.remove("hidden")
            } else {
                preloader.classList.add("hidden")
            }
        },
        filterByIMG: function (item) {
            if (item.image[3]["#text"]) {
                return item
            }
        },
        // To be used with .map(), returns a clean track object
        createTrackObj: function (item) {
            var artist = ""

            if (item.artist["#text"]) {
                artist = item.artist["#text"]
            } else {
                artist = item.artist.name
            }

            return {
                artist: artist,
                name: item.name,
                slug: helpers.slugify(artist) + '+' + helpers.slugify(item.name),
                track: artist + " - " + item.name,
                imgSrc: item.image[3]["#text"]
            }
        },
        // Get the recent tracks from API
        getRecentTracks: function () {
            var self = this

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest(),
                    limit = 50,
                    url = self.baseURL + "?method=user.getrecenttracks&user=" + self.user + "&api_key=" + config.key + "&format=" + self.format + "&limit=" + limit

                self.showPreloader(true)

                request.open('GET', url, true)

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        var data = JSON.parse(request.responseText)
                        resolve(data)
                    } else {
                        reject('error')
                    }
                }

                request.onerror = function() {
                    reject('error')
                }

                request.send()
            })
        },
        // Get individual track info from API
        getTrackInfo: function (artist, name) {
            var self = this

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest(),
                    url = self.baseURL + "?method=track.getInfo&api_key=" + config.key + "&artist=" + artist + "&track=" + name + "&autocorrect=1&format=" + self.format

                self.showPreloader(true)

                request.open('GET', url, true)

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        var data = JSON.parse(request.responseText)
                        resolve(data)
                    } else {
                        reject('error')
                    }
                }

                request.onerror = function() {
                    reject('error')
                }

                request.send()
            })
        },
        // Get similar tracks from API
        getSimilarTracks: function (artist, name) {
            var self = this

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest(),
                    url = self.baseURL + "?method=track.getsimilar&api_key=" + config.key + "&artist=" + artist + "&track=" + name + "&autocorrect=1&format=" + self.format + "&limit=12"

                self.showPreloader(true)

                request.open('GET', url, true)

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        var data = JSON.parse(request.responseText)
                        resolve(data)
                    } else {
                        reject('error')
                    }
                }

                request.onerror = function() {
                    reject('error')
                }

                request.send()
            })
        },
        // Manipulate recieved track data
        setRecentTrackData: function () {
            var self = this

            this.getRecentTracks()
                .then(function (data) {
                    var tracks = data.recenttracks.track,
                        tracksWithIMG = []

                    // Set current track to first song of array
                    content["current-track"] = data.recenttracks.track[0].artist["#text"] + " - " + data.recenttracks.track[0].name

                    // Remove first track of array
                    tracks.shift()

                    // Create new array where only tracks with images exist
                    tracksWithIMG = tracks.filter(self.filterByIMG)

                    // Create a clean array and put this in to the tracklist
                    content.trackList = tracksWithIMG.map(self.createTrackObj)

                    content.render()
                    self.showPreloader(false)
                })
                .catch(function (err) {
                    routie('error')
                    console.error(err)
                })
        }
    }

    var sections = {
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

    var detailPage = {
        container: document.querySelector("#track"),
        content: {
            tags: [],
            "similar-tracks": []
        },
        trackInfoLoading: false,
        similarTracksLoading: false,
        renderMain: function () {
            // TODO img via transparency inladen
            if(this.content.img) {
                this.container.querySelector("img").src = this.content.img
            }

            Transparency.render(document.getElementById('track'), this.content)
        },
        renderSimilar: function () {
            var ul = document.querySelector("#similar-tracks")

            ul.innerHTML = ""

            this.content["similar-tracks"].forEach(function (item) {
                var html = '<li><div><img src="' + item.imgSrc + '"><a href="#track/'+ item.slug + '">' + item.track + '</a></div></li>'
                ul.insertAdjacentHTML('afterbegin', html)
            })
        },
        // If both the trackInfo and SimilarTracks API calls are done hide the preloader.
        checkLoading: function () {
            if(!this.trackInfoLoading && !this.similarTracksLoading) {
                api.showPreloader(false)
            }
        },
        setContent: function (track) {
            var self = this

            api.getTrackInfo(track[0], track[1])
                .then(function (data) {

                    if(data.error) {
                        // If there is an error return this to the user
                        document.querySelector(".details").innerHTML = '<h1>' + data.message + '</h1>'
                    } else {
                        self.content.artist = data.track.artist.name
                        self.content.name = data.track.name
                        self.content.tags = data.track.toptags.tag
                        self.content.listeners = data.track.listeners
                        self.content.img = data.track.album.image[3]["#text"]

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
                    var tracks = data.similartracks.track.filter(api.filterByIMG)
                    self.content["similar-tracks"] = tracks.map(api.createTrackObj)
                    self.renderSimilar()
                    self.similarTracksLoading = false;
                    self.checkLoading()
                })
                .catch(function (err) {
                    console.error(err)
                    api.showPreloader(false)
                })
        },
        init: function (slug) {
            this.setContent(helpers.unslugify(slug))
        }
    }

    var helpers = {
        // source: https://gist.github.com/mathewbyrne/1280286
        // Slugify niet naar apart router obj verplaatst omdat er ook een unslugify functie bijgekomen is en het anders heel verspreid staat.
        slugify: function (text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '')            // Trim - from end of text
        },
        unslugify: function (slug) {
            return slug.split("-").join(" ").split("+")
        }
    }

    var router = {
        routes: routie({
            'now-playing': function() {
                sections.toggle("#now-playing")
                api.setRecentTrackData()
            },
            'recent-tracks': function() {
                sections.toggle("#recent-tracks")
                api.setRecentTrackData()
            },
            'track/:track': function(slug) {
                sections.toggle("#track")
                detailPage.init(slug)
            },
            'track-not-found': function() {
                sections.toggle("#track-not-found")
                api.showPreloader(false)
            },
            'error': function() {
                sections.toggle("#error")
                api.showPreloader(false)
            }
        })
    }

    app.init()

}())
