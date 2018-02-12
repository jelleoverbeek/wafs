(function () {
    "use strict"

    // General app object
    var app = {
        init: function() {
            nav.init()
            api.getData()
        }
    }

    // Adding event listeners to a elements to prevent the default scroll behaviour
    var nav = {
        init: function () {
            document.querySelectorAll("nav a").forEach(function (element){
                element.addEventListener("click", function(event) {
                    event.preventDefault()
                    location.hash = this.hash
                })
            })
        }
    }

    var content = {
        "current-track": "",
        "track-list": [],
        render: function () {
            Transparency.render(document.getElementById('now-playing'), this);
            Transparency.render(document.getElementById('recent-tracks'), this);
        }
    }

    var api = {
        user: "jelleoverbeek",
        key: "7ba5f2c9030c85c7b3f7c5816d87960c",
        format: "json",
        getRecentTracks: function () {
            var self = this;

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest(),
                    limit = 10,
                    url = "//ws.audioscrobbler.com/2.0?method=user.getrecenttracks&user=" + self.user + "&api_key=" + self.key + "&format=" + self.format + "&limit=" + limit

                request.open('GET', url, true)

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {

                        var data = JSON.parse(request.responseText),
                            tracks = data.recenttracks.track,
                            artist = data.recenttracks.track[0].artist["#text"],
                            song = data.recenttracks.track[0].name

                        content["current-track"] = artist + " - " + song

                        tracks.forEach(function (track) {
                            var artist = track.artist["#text"],
                                song = track.name,
                                trackName = artist + " - " + song

                            content["track-list"].push({
                                track: trackName
                            })
                        })

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
        getData: function () {
            this.getRecentTracks()
                .then(function () {
                    content.render()
                })
                .catch(function (err) {
                    console.error(err);
                });
        }
    }

    // Sections object with toggle function to show/hide sections
    var sections = {
        getSections: function() {
            return document.querySelectorAll("section")
        },
        toggle: function (route) {

            this.getSections().forEach(function(element) {
                element.classList.add("hidden")
            })

            document.querySelector(route).classList.remove("hidden")
        }
    }

    routie('now-playing', function() {
        sections.toggle("#now-playing")
    });

    routie('recent-tracks', function() {
        sections.toggle("#recent-tracks")
    });

    app.init()

}())
