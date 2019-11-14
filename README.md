# generals.io bot in browser

This is a bot for [generals.io](http://generals.io). Read the tutorial associated with making a bot at [dev.generals.io/api#tutorial](http://dev.generals.io/api#tutorial).

## Usage

```
$ git clone https://github.com/ryndh/generalsBot.git
$ cd generalsBot
$ npm install
$ npm start
```
Create a `config.js` file with the following structure:

```javascript
export default {
  BOT_USER_ID: '*yourUserID*',
  BOT_USER_ID2: '2ba77a4e-dd84-4543-a85a-2bf018181a87',
  custom_game_id: 'something', //come up with some game ID
  username: '[Bot]*name*',
  username2: '[Bot]*name*'
  // The reason for using 2 usernames/IDs is that you can open a second tab and go to /play/2 and have 2 bots play each other.
}
```

Go to localhost:3000

Game will be live at bot.generals.io/games/*custom_game_id from config*
