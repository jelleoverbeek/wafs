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
        trackList: [],
        render: function () {
            // Render now playing text using transparencyjs
            Transparency.render(document.getElementById('now-playing'), this);

            // Add tracklist to html
            this.trackList.forEach(function (item) {
                document.querySelector("#track-list").innerHTML += '<li><div><img src="' + item.imgSrc + '"><span>' + item.track + '</span></div></li>'
            })
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
                    limit = 50,
                    url = "https://ws.audioscrobbler.com/2.0?method=user.getrecenttracks&user=" + self.user + "&api_key=" + self.key + "&format=" + self.format + "&limit=" + limit

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
        getData: function () {
            this.getRecentTracks()
                .then(function (data) {
                    var tracks = data.recenttracks.track,
                        tracksWithIMG = [],
                        tracksWithMBID = []

                    content["current-track"] = data.recenttracks.track[0].artist["#text"] + " - " + data.recenttracks.track[0].name

                    // Filter array by images that have an image
                    function filterByIMG(item) {
                        if (item.image[3]["#text"] !== "") {
                            return item
                        }
                    }

                    // Filter array by images that have an mbid
                    function filterByMBID(item) {
                        if (item.mbid !== "") {
                            return item
                        }
                    }

                    tracksWithIMG = tracks.filter(filterByIMG)
                    tracksWithMBID = tracks.filter(filterByMBID)

                    // Only push 10 items to the content object
                    for(var i = 0; i < 12; i++) {
                        content.trackList.push({
                            track: tracksWithIMG[i].artist["#text"] + " - " + tracksWithIMG[i].name,
                            imgSrc: tracksWithIMG[i].image[3]["#text"]
                        })
                    }

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
