var io = require('socket.io-client');
require('dotenv').config()

var socket = io('http://botws.generals.io');

socket.on('disconnect', function() {
	console.error('Disconnected from server.');
	process.exit(1);
});

socket.on('connect', function() {
	console.log('Connected to server.');

	/* Don't lose this user_id or let other people see it!
	 * Anyone with your user_id can play on your bot's account and pretend to be your bot.
	 * If you plan on open sourcing your bot's code (which we strongly support), we recommend
	 * replacing this line with something that instead supplies the user_id via an environment variable, e.g.
	 * var user_id = process.env.BOT_USER_ID;
	 */
	var user_id = process.env.BOT_USER_ID2;

	var username = '[Bot]rukee2';

	// Set the username for the bot.
	// This should only ever be done once. See the API reference for more details.
	socket.emit('set_username', user_id, username);

	// Join a custom game and force start immediately.
	// Custom games are a great way to test your bot while you develop it because you can play against your bot!
	var custom_game_id = '13fe3e51-fbc6-43ff';

	// socket.emit('play', user_id);	
	
	socket.emit('join_private', custom_game_id, user_id);
	setTimeout(()=> {
		socket.emit('set_force_start', custom_game_id, true);
	}, 100)
	console.log('Joined custom game at http://bot.generals.io/games/' + encodeURIComponent(custom_game_id));

	// When you're ready, you can have your bot join other game modes.
	// Here are some examples of how you'd do that:

	// Join the 1v1 queue.
	// socket.emit('join_1v1', user_id);

	// Join the FFA queue.
	// socket.emit('play', user_id);

	// Join a 2v2 team.
	// socket.emit('join_team', 'team_name', user_id);
});

// Terrain Constants.
// Any tile with a nonnegative value is owned by the player corresponding to its value.
// For example, a tile with value 1 is owned by the player with playerIndex = 1.
var TILE_EMPTY = -1;
var TILE_MOUNTAIN = -2;
var TILE_FOG = -3;
var TILE_FOG_OBSTACLE = -4; // Cities and Mountains show up as Obstacles in the fog of war.

// Game data.
var playerIndex;
var generals; // The indicies of generals we have vision of.
var cities = []; // The indicies of cities we have vision of.
var map = [];

var myGeneralLocation = null
var myGeneralLocationKnown = false
var pathToTarget = []
var newArmyIndex
var terrain



var mapWidth
var mapHeight
var mapSize

/* Returns a new array created by patching the diff into the old array.
 * The diff formatted with alternating matching and mismatching segments:
 * <Number of matching elements>
 * <Number of mismatching elements>
 * <The mismatching elements>
 * ... repeated until the end of diff.
 * Example 1: patching a diff of [1, 1, 3] onto [0, 0] yields [0, 3].
 * Example 2: patching a diff of [0, 1, 2, 1] onto [0, 0] yields [2, 0].
 */
function patch(old, diff) {
	var out = [];
	var i = 0;
	while (i < diff.length) {
		if (diff[i]) {  // matching
			Array.prototype.push.apply(out, old.slice(out.length, out.length + diff[i]));
		}
		i++;
		if (i < diff.length && diff[i]) {  // mismatching
			Array.prototype.push.apply(out, diff.slice(i + 1, i + 1 + diff[i]));
			i += diff[i];
		}
		i++;
	}
	return out;
}

function getRowCol(square){
	var row = Math.floor(square / mapWidth)
	var col = square % mapWidth
	return [row, col]

}

function possibleMovesFromLocation(square){

	var [row, col] = getRowCol(square)

	var leftSquare = col > 0 ? square - 1 : -2
	var rightSquare = col < mapWidth - 1 ? square + 1 : -2
	var downSquare = row < mapHeight -1 ? square + mapWidth : -2
	var upSquare = row > 0 ? square - mapWidth : -2

	var possibleMoves = [leftSquare, rightSquare, upSquare, downSquare].filter(el => el > -1 && terrain[el] !== -2)

	return possibleMoves //As indexes
}

function findMyPath(terrainMap, currentLocation, destination, path = [currentLocation], wrongWay = []){
  if (currentLocation !== destination){

    var terrain = terrainMap
    let potentialMoves = possibleMovesFromLocation(currentLocation, terrain)
    let filteredMoves = potentialMoves.filter(el => !wrongWay.includes(el))

    var [targetRow, targetCol] = getRowCol(destination)
    var movesCopy = filteredMoves.slice()
    var moveScore = mapWidth + mapHeight
    var move = movesCopy[0]
    movesCopy.forEach(tile => {
      var [moveRow, moveCol] = getRowCol(tile)
      var score = Math.abs(targetRow - moveRow) + Math.abs(targetCol - moveCol)
      // console.log(`Tile: ${tile} Score: ${score} CityClosestMove: ${cityClosestMove}`)
      if (score <= moveScore){
        moveScore = score
        path.includes(tile) ? null : move = tile
      }  
    })

    let nextMove = move

    if(path.includes(nextMove)){
      wrongWay.push(currentLocation)
      var wentWrong = path.indexOf(nextMove)
      path.splice(wentWrong)
		}
    path.push(nextMove)
    findMyPath(terrainMap, nextMove, destination, path, wrongWay)
  }
  return path
}

socket.on('game_start', function(data) {
	// Get ready to start playing the game.
	playerIndex = data.playerIndex;
	var replay_url = 'http://bot.generals.io/replays/' + encodeURIComponent(data.replay_id);
	console.log('Game starting! The replay will be available after the game at ' + replay_url);
	console.log(`PlayerIndex is ${playerIndex}`)
});

socket.on('game_update', function(data) {

	// Patch the city and map diffs into our local variables.
	cities = patch(cities, data.cities_diff);
	map = patch(map, data.map_diff);
	generals = data.generals;
	// console.log(data.generals)
	// The first two terms in |map| are the dimensions.
	mapWidth = map[0];
	mapHeight = map[1];
	mapSize = mapWidth * mapHeight;
	myGeneralLocationKnown ? null : myGeneralLocation = generals.filter(el => el > 0)[0]
	// console.log(myGeneralLocation)

	// The next |size| terms are army values.
	// armies[0] is the top-left corner of the map.
	var armies = map.slice(2, mapSize + 2);

	// The last |size| terms are terrain values.
	// terrain[0] is the top-left corner of the map.
	terrain = map.slice(mapSize + 2, mapSize + 2 + mapSize);
	
	// Make a move.
	while (true) {

		var is50 = false

		if (pathToTarget.length > 0){
			var next = pathToTarget.shift()
			socket.emit('attack', newArmyIndex, next, is50)
			newArmyIndex = next
			console.log('SAVED MOVES')
			break
		} else {

			// Pick a random tile.
			console.log(cities)
			// Find all my tiles
			var myOccupiedTerrain = []
			var enemyTerrain = []
			terrain.forEach((el, idx) => {
				if(el === playerIndex){
					myOccupiedTerrain.push(idx)
				}
			})
			terrain.forEach((el, idx) => {
				if(el > -1 && el !== playerIndex){
					enemyTerrain.push(idx)
				}
			})
			
			var biggestArmySize = armies[myOccupiedTerrain[0]]
			// console.log(`Biggest Size Army: ${biggestArmySize}`)
			var biggestArmyIndex = myOccupiedTerrain[0]
			// console.log(`BiggestIndex: ${biggestArmyIndex}`)
			myOccupiedTerrain.forEach(el => {
				if(armies[el] > biggestArmySize){
					biggestArmySize = armies[el]
					biggestArmyIndex = el
				}
			})
			var index = biggestArmyIndex
			// console.log(`Start Index: ${index}`)
			
			var options = possibleMovesFromLocation(index)
			var getTheGeneral = false
			var getTheArmy = false
			var getTheCity = false
			var biggestEnemyArmy
			var visibleCities
			var targetVisibleCity = []

			if(cities.length > 0 && myOccupiedTerrain.length > 8){
				visibleCities = cities.slice()
				for(i = 0; i < visibleCities.length; i++){
					if(terrain[visibleCities[i]] === playerIndex){
						visibleCities.splice(i, 1, 'Player Controlled')
					}
				}
				visibleCities.forEach(city => {
					if (city !== 'Player Controlled'){
						targetVisibleCity.push(city)
					}
				})
				console.log(`Target: ${targetVisibleCity}`)
				console.log(`VisibleCities: ${visibleCities}`)
			}
			
			if(targetVisibleCity[0]){
				getTheCity = findMyPath(terrain, index, targetVisibleCity[0])[1]
			}
			
			if(enemyTerrain[0]){
				biggestEnemyArmy = armies[enemyTerrain[0]]
				getTheArmy = enemyTerrain[0]
				
				enemyTerrain.forEach(el => {
					if(armies[el] > biggestEnemyArmy){
						biggestEnemyArmy = armies[el]
						getTheArmy = el
					}
				})
			}
			
			// console.log(`Options: ${options}`)
			var targetOptions = options.filter(el => terrain[el] !== -2 && terrain[el] !== playerIndex && terrain[el] > 0)
			// console.log(targetOptions)
			var preferredOptions = options.filter(el => terrain[el] !== -2 && terrain[el] !== playerIndex)
			
			var viableOptions = options.filter(el => terrain[el] !== -2)
			// console.log(`Preferred Options: ${preferredOptions}`)
			// console.log(`Viable Options: ${viableOptions}`)
			if (getTheGeneral) {
				pathToTarget = findMyPath(terrain, index, getTheGeneral).splice(1, 2)
				myMove = pathToTarget[0]
				console.log(`Moving Towards A General at ${getTheGeneral}. Move: ${myMove}`)
			} else if (getTheArmy){
				console.log('getting path')
				pathToTarget = findMyPath(terrain, index, getTheArmy).splice(1, 2)
				myMove = pathToTarget[0]
				console.log(`Moving Towards An Army at ${getTheArmy}. Move: ${myMove}`)
			} else if (getTheCity && myOccupiedTerrain.length > 8) {
				console.log(`getting path from ${index} to ${getTheCity}`)
				pathToTarget = findMyPath(terrain, index, getTheCity).splice(1, 2)
				myMove = pathToTarget[0]
				console.log(`Moving Towards City at ${getTheCity}. Move: ${myMove}`)
				console.log(`Path: ${pathToTarget}`)
			} else if (targetOptions.length > 0) {
				myMove = targetOptions[Math.floor(Math.random() * targetOptions.length)]
			} else if(preferredOptions.length > 0){
				myMove = preferredOptions[Math.floor(Math.random() * preferredOptions.length)]
			} else {
				myMove = viableOptions[Math.floor(Math.random() * viableOptions.length)]
			}
			
			// console.log(`Choice: ${choice}`)
			if (myGeneralLocation === index){
				is50 = true
			}
			newArmyIndex = myMove
			socket.emit('attack', index, myMove, is50)
			
			break;
		}
	}
});
	
	function leaveGame() {
	socket.emit('leave_game');
	process.exit(1);
}

socket.on('game_lost', leaveGame);

socket.on('game_won', leaveGame);