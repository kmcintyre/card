card
============

Project to teach myself client/server javascript, websockets, Android SDK, and HTML5 canvas.

Log:

Day 15 - 16:

Integrate with <a href="http://autobahn.ws/android">Autobahn.ws</a> creating the echo ws activity

Moved from socket.io to <a href="http://einaros.github.io/ws/">ws</a> since autobahn.ws socket.io doesn't support ws: protocol. 

Moved from to PNG due to AngEngine not supporting card SVGs

Next up - figure out how HTML5 and Android version can use the same javascript objects.

Day 12 - 14:

Moving my mp_blackjack since I'm doing more games. Essentially a rename to card. 

Combine website and android code.

Prepare for multiple player using <a href="http://nodejs.org/">node.js</a> and <a href="http://socket.io/">socket.io</a>, research <a href="http://www.commonjs.org/">commonJS</a>.

Day 10 - 11:

Published project to <a href="https://play.google.com/store/apps/details?id=com.nwice.card">google play</a>.  Forked over 25$ to publish.  Created the publishing assets, necessary screenshots etc. for google play store...bleh.

Put together <a href="http://www.nwice.com/card">simple html page</a> for promotion.  It uses canvg svg to illustrate how awesome the card svgs look in firefox and chrome.

Day 2 - 9:

Changed project to Android game.  I did the easiest game I could think of:  War! Hoping to release on google play just to get the experience.

Uses <a href="http://www.andengine.org/">AndEngine</a>.

Also uses <a href="https://github.com/nicolasgramlich/AndEngineSVGTextureRegionExtension">AndEngineSVGTextureRegionExtension</a>.

And <a href="http://code.google.com/p/vectorized-playing-cards/">Vector Playing Card Library 1.3</a>

Day 1:

Write some prototypes for card, deck.

I want to be able to render in 2d a set of cards.
