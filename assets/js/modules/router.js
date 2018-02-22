import sections from './sections.js'
import content from './content.js'
import api from './api.js'
import detailPage from './detail-page.js'

// Router function
const router = {
    routes: routie({
        'now-playing': function() {
            sections.toggle("#now-playing")
            content.setRecentTracksData()
        },
        'recent-tracks': function() {
            sections.toggle("#recent-tracks")
            content.setRecentTracksData()
        },
        'track/:track': function(slug) {
            sections.toggle("#track")
            detailPage.init(slug)
        },
        'error': function() {
            sections.toggle("#error")
            api.showPreloader(false)
        }
    }),
    error: function (message) {
        document.querySelector("#error h2").textContent = message
        api.showPreloader(false)
        routie('error')
    }
}

export default router