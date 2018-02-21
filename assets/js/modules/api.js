import helper from './helper.js'

const api = {
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
    // To be used with a .filter() function, returns an array where only tracks with images exist
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
            slug: helper.slugify(artist) + '+' + helper.slugify(item.name),
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
    }
}

export default api