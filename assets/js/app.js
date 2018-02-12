(function () {
    "use strict"

    // General app object
    var app = {
        init: function() {
            nav.init()
            api.getRecentTracks()
        }
    }

    // Adding event listeners to a elements to prevent the default scroll behaviour
    var nav = {
        init: function () {
            console.log(document.querySelectorAll("nav a")[0]);

            document.querySelectorAll("nav a").forEach(function (element){
                element.addEventListener("click", function(event) {
                    event.preventDefault()
                    location.hash = this.hash
                })
            })
        }
    }


    var api = {
        user: "jelleoverbeek",
        key: "7ba5f2c9030c85c7b3f7c5816d87960c",
        format: "json",
        limit: 10,
        setCurrentTrack: function (track) {
            document.querySelector("#the-track").innerHTML = track
        },
        setPlayedTracks: function (tracks) {
            tracks.forEach(function (track) {
                document.querySelector("#played-tracks-list").innerHTML += "<li>" + track.artist["#text"] + " - " + track.name + "</li>"
            })
        },
        getRecentTracks: function () {
            var self = this,
                request = new XMLHttpRequest(),
                url = "//ws.audioscrobbler.com/2.0?method=user.getrecenttracks&user=" + this.user + "&api_key=" + this.key + "&format=" + this.format + "&limit=" + this.limit

            request.open('GET', url, true)

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {

                    var data = JSON.parse(request.responseText),
                        tracks = data.recenttracks.track,
                        artist = data.recenttracks.track[0].artist["#text"],
                        song = data.recenttracks.track[0].name

                    self.setCurrentTrack(artist + " - " + song)
                    self.setPlayedTracks(tracks)

                } else {
                    // We reached our target server, but it returned an error
                }
            }

            request.onerror = function() {
                console.log("error")
            }

            request.send()
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

    routie('current-track', function() {
        sections.toggle("#current-track")
    });

    routie('played-tracks', function() {
        sections.toggle("#played-tracks")
    });

    app.init()

}())
