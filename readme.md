## Socket.io Examples and Lesser Project
This repository is intended to help me learn socket.io and also to implement my learning in a live project. 

### Examples
chat-app and socket.io are provided by [the documentation for socket.io](https://socket.io/get-started/). These projects should be copies of those examples as of 20210501

### Lesser Project
The test project is a Websockets connection to Twitch chat that allows users in the chat to issue commands that affect the stream attached to the project. 

It's very simple to use once it's set up: 

First, install nodejs. If that step seems too complicated, this project may not be user-friendly enough for you.

1. twitch-pubsub-project has to be set up to listen to a user's Twitch channel. Much of this information can be found in [this tutorial](https://www.twilio.com/blog/creating-twitch-chat-bots-with-node-js), or on the library used to interact with Twitch's API, [tmi.js](https://tmijs.com/)

If the Pubsub talks in your chat, it is properly set up. 

2. Run the socket-test index.js from its root directory. This will establish an Express server which will listen at localhost:3000. 

3. Add a Browser Source in OBS/SLOBS to localhost:3000. 

4. If the socket.io server is listening, it will say so when running in the console, and it will acknowledge a connection when the webpage opens in OBS/SLOBS. 

5. Under the current configuration, new videos must be added to the root in index.html and connected to the same with a <video> tag identified and classed according to the same standard as the provided example. Then an emitter must be placed in the pubsub index.js file and an equivalent event listener must be added to the socket-test index.js file.



