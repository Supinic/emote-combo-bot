# emote-combo-bot
A simple bot to use Twitch.tv combo emotes on multiple accounts quickly in succession.

# Requirements
Node.JS version >= 8

# Config
Set up your accounts, trigger message, response messages and authorized users in the config file within `emote-combo-bot.js`. Comments are provided.

# How to run
Clone or download this repo, install `coffea` using `npm i coffea` and replace `./node_modules/coffea/lib/plugins/server.js` with the provided fixed `server.js` file.
Then run with `node emote-combo-bot.js`.
