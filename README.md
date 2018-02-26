# Introduction
School project where the goal was to make a single page web application. 

#### Live demo
https://jelleoverbeek.github.io/wafs/

![Preview](https://d.pr/i/rHG8Zg+ "Preview")

#### Purpose
This app shows my recent music activity and shows similar tracks.

#### What you need to know 
This app is build for a school project. It's my first app using a object literal pattern.

**Interaction diagram: current track & recent tracks flow**  
![current track & recent tracks flow](https://d.pr/i/bvGQnU+ "current track & recent tracks flow")

**Interaction diagram: detail page flow (Track info & similar tracks)**
![detail page flow (Track info & similar tracks)](https://d.pr/i/C7nmEa+ "detail page flow (Track info & similar tracks)")

**Actor diagram**  
![actor diagram](https://d.pr/i/POVKiX+ "actor diagram")


#### API 
it uses the Last.fm API to get info about this music. I connected my Spotify to Last.fm to populate the last.fm account.  

**Api limit according to Last.fm terms of service**  
*"You will implement suitable caching in accordance with the HTTP headers sent with web service responses. You will not make more than 5 requests per originating IP address per second, averaged over a 5 minute period, without prior written consent. You agree to cache similar artist and any chart data (top tracks, top artists, top albums) for a minimum of one week."*

## Features
* Show current playing track (if I'm not playing any track it shows the latest one)
* Show my recently played tracks
* Show similar tracks of tracks
* Detail pages of tracks will be stored in localstorage

## Libraries
* [Transparency](https://github.com/leonidas/transparency)
* [Routie](https://github.com/jgallen23/routie)

## What principles/best practices did you follow
* I used the object literal pattern while developing this app.
* Don't use global variables/objects
* Declare variables at top of scope
* Use short clear meaningful names (English)
* Work in strict mode
* camelCase your code if(code != Constructor || CONSTANTS)
* Place external scripts at the bottom of the page
* Indent your code

## Advantages and disadvantages of JavaScript libraries/frameworks

## Advantages
* Less code to write.
* Quicker to make applications (less costs)
* Support from communities or development teams
* More readable code
* No browser compatibility problems
* Code is more secure because more people can evaluate it.
* Security flaws can be detected easier because it's open source.
 
### Disadvantages
* Security flaws can be detected easier because it's open source.
* Limited possibilities because of the framework.
* You don't learn the underlying code properly
* They often lack functionality that a project needs. 
* Less performance because of loading unnecessary code.
* More new things to learn if framework/library updates it code 
* Dependent on others work

## Advantages and disadvantages of client-side single page web apps

### Advantages
* Better user experience because you only have to load once.
* Quick in use after loading.
* Back-end and front-end are separated
* Easier to make mobile app because back-end is reusable.

### Disadvantages
* Hard to implemented SEO properly
* Bad performance because it's heavy (especially for mobile devices).
* Heavy client side frameworks are needed to load the app.
* Site getting slower when data increases
* JavaScript is often needed use the page (bad accessibility)
* Analytics tools don't expect single page web apps.

### Best practices
* Don't use global variables/objects
* Declare variables at top of scope
* Use short clear meaningful names (English)
* Work in strict mode
* camelCase your code if(code != Constructor || CONSTANTS)
* Place external scripts at the bottom of the page
* Indent your code

## Pull requests
**Week 1**  
https://github.com/velomovies/wafs/pull/1  
https://github.com/dipsaus9/wafs/pull/1

**Week 2**  
https://github.com/velomovies/wafs/pull/5  
https://github.com/ViennaM/wafs/pull/3  

## Roadmap
* Seperate the HTML into components 
* Less random album arts by getting them from another source
* Replace transparency with other template engine
* Rewrite everything to ES6