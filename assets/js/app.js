(function () {
    "use strict"

    // General app object
    var app = {
        init: function() {

            if(!location.hash) {
                routie('now-playing');
            }

            nav.init()
            api.handleRecentTrackData()
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
                if(item.mbid) {
                    document.querySelector("#track-list").innerHTML += '<li><div><img src="' + item.imgSrc + '"><a href="#track/'+ item.slug + '">' + item.track + '</a></div></li>'
                } else {
                    document.querySelector("#track-list").innerHTML += '<li><div><img src="' + item.imgSrc + '"><span>' + item.track + '</span></div></li>'
                }
            })
        }
    }

    var api = {
        user: "jelleoverbeek",
        format: "json",
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
        getTrackInfo: function (mbid) {
            var self = this;

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest(),
                    url = "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + config.key + "&mbid=" + mbid + "&format=" + self.format

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
        handleRecentTrackData: function () {
            this.getRecentTracks()
                .then(function (data) {
                    var tracks = data.recenttracks.track,
                        tracksWithIMG = [],
                        tracksWithMBID = []

                    content["current-track"] = data.recenttracks.track[0].artist["#text"] + " - " + data.recenttracks.track[0].name
                    tracks.shift()

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
                    // tracksWithMBID = tracksWithIMG.filter(filterByMBID)

                    // Only push 12 items to the content object
                    for(var i = 0; i < 12; i++) {
                        content.trackList.push({
                            artist: tracksWithIMG[i].artist["#text"],
                            name: tracksWithIMG[i].name,
                            slug: helper.slugify(tracksWithIMG[i].artist["#text"]) + '+' + helper.slugify(tracksWithIMG[i].name),
                            track: tracksWithIMG[i].artist["#text"] + " - " + tracksWithIMG[i].name,
                            imgSrc: tracksWithIMG[i].image[3]["#text"],
                            mbid: tracksWithIMG[i].mbid
                        })
                    }

                    console.log(content);

                    content.render()
                })
                .catch(function (err) {
                    console.error(err);
                });
        },
        handleTrackData: function (mbid) {
            this.getTrackInfo(mbid)
                .then(function (data) {
                    console.log(data)
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
        hideSections: function () {
            this.getSections().forEach(function(element) {
                element.classList.add("hidden")
            })
        },
        toggle: function (route) {
            this.hideSections()
            document.querySelector(route).classList.remove("hidden")
        }
    }

    var detailPage = {
        init: function (slug) {
            var container = document.querySelector("#track");

            var item = content.trackList.filter(function (item) {
                if(item.slug === slug) {
                    return item
                }
            })

            container.querySelector("h1").innerHTML = item[0].track
            container.querySelector("img").src = item[0].imgSrc

            console.log(item[0].mbid)

            api.handleTrackData(item[0].mbid)
        }
    }

    var helper = {
        // source: https://gist.github.com/mathewbyrne/1280286
        slugify: function (text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }
    }

    routie({
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
    });

    app.init()

}())
