(function () {
    "use strict"

    // General app object
    var app = {
        init: function() {
            if(!location.hash) {
                routie('now-playing');
            }

            api.handleRecentTrackData()
        }
    }

    // Object with content en render functions
    var content = {
        "current-track": "",
        trackList: [],
        render: function () {
            // Render now playing text using transparencyjs
            Transparency.render(document.getElementById('now-playing'), this);

            // Add 12 items of tracklist to html
            for(var i = 0; i < 12; i++) {
                document.querySelector("#track-list").innerHTML += '<li><div><img src="' + this.trackList[i].imgSrc + '"><a href="#track/'+ this.trackList[i].slug + '">' + this.trackList[i].track + '</a></div></li>'
            }
        }
    }

    // Api functions
    var api = {
        // Last fm user
        user: "jelleoverbeek",
        // return format of API (JSON/XML)
        format: "json",
        // Filter array by images that have an image
        filterByIMG: function (item) {
            if (item.image[3]["#text"] !== "") {
                return item
            }
        },
        setTrackList: function (item) {
            return {
                artist: item.artist["#text"],
                name: item.name,
                slug: helpers.slugify(item.artist["#text"]) + '+' + helpers.slugify(item.name),
                track: item.artist["#text"] + " - " + item.name,
                imgSrc: item.image[3]["#text"]
            }
        },
        // Get the recent tracks from API
        getRecentTracks: function () {
            var self = this;

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest(),
                    limit = 50,
                    url = "https://ws.audioscrobbler.com/2.0?method=user.getrecenttracks&user=" + self.user + "&api_key=" + config.key + "&format=" + self.format + "&limit=" + limit

                request.open('GET', url, true)

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        var data = JSON.parse(request.responseText);
                        resolve(data)
                    } else {
                        reject('error')
                    }
                }

                request.onerror = function() {
                    reject('error');
                }

                request.send()
            });
        },
        // Get individual track info form API
        getTrackInfo: function (artist, name) {
            var self = this;

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest(),
                    url = "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + config.key + "&artist=" + artist + "&track=" + name + "&autocorrect=1&format=" + self.format

                request.open('GET', url, true)

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        var data = JSON.parse(request.responseText);
                        resolve(data)
                    } else {
                        reject('error')
                    }
                }

                request.onerror = function() {
                    reject('error');
                }

                request.send()
            });
        },
        // Manipulate recieved track data
        handleRecentTrackData: function () {
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
                    content.trackList = tracksWithIMG.map(self.setTrackList);

                    content.render()
                })
                .catch(function (err) {
                    console.error(err);
                });
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
            tags: []
        },
        render: function () {
            // TODO img via transparency inladen
            if(this.content.img) {
                this.container.querySelector("img").src = this.content.img
            }

            Transparency.render(document.getElementById('track'), this.content);
        },
        setContent: function (track) {
            var self = this

            api.getTrackInfo(track[0], track[1])
                .then(function (data) {
                    self.content.artist = data.track.artist.name
                    self.content.name = data.track.name
                    self.content.tags = data.track.toptags.tag
                    self.content.listeners = data.track.listeners

                    console.log(data.track)

                    if(data.track.album.image[3]["#text"]) {
                        self.content.img = data.track.album.image[3]["#text"]
                    }

                    self.render();
                })
                .catch(function (err) {
                    console.error(err);
                });
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
                .replace(/-+$/, '');            // Trim - from end of text
        },
        unslugify: function (slug) {
            return slug.split("-").join(" ").split("+")
        }
    }

    var router = {
        routes: routie({
            'now-playing': function() {
                sections.toggle("#now-playing")
            },
            'recent-tracks': function() {
                sections.toggle("#recent-tracks")
            },
            'track/:track': function(slug) {
                sections.toggle("#track")
                detailPage.init(slug)
            }
        })
    }

    app.init()

}())
