/* eslint-disable no-unused-expressions */
/* eslint-disable no-loop-func */

import io from 'socket.io-client'
import config from './config'

export function Start() {
	setTimeout(()=> {
		socket.emit('set_force_start', config.custom_game_id, true);
	}, 100)	
}

export function Join(userID, username) {
	socket.emit('set_username', userID, username);
	socket.emit('join_private', config.custom_game_id, userID);
}
export function Team(gameId, team){
	socket.emit('set_custom_team', gameId, team)
}

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

	// Set the username for the bot.
	// This should only ever be done once. See the API reference for more details.

	// Join a custom game and force start immediately.
	// Custom games are a great way to test your bot while you develop it because you can play against your bot!

	// socket.emit('play', user_id);	
	
	console.log('Joined custom game at http://bot.generals.io/games/' + encodeURIComponent(config.custom_game_id));

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

var teams
var myTeam

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
		if(nextMove === undefined){
			console.log(`Uh oh. Path: ${path}. Wrong Way: ${wrongWay}. Destination: ${destination}`)//Breaks here every now and then
			var bailOutOptions = possibleMovesFromLocation(path[0])
			var viableBailOutOptions = bailOutOptions.filter(el => terrain[el] !== -2)
			var bailOutMove = viableBailOutOptions[Math.floor(Math.random() * viableBailOutOptions.length)]
			path.splice(1, path.length, bailOutMove, destination)
		}
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
	teams = data.teams
	myTeam = teams[playerIndex]
});

let enemyGenerals
let savedGenerals = []
var myMove

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

	enemyGenerals = generals.filter((val, idx) => idx !== playerIndex && val > -1 && teams[terrain[val]] !== myTeam )

	if(enemyGenerals[0]){
		enemyGenerals.forEach(general => savedGenerals.includes(general) ? null : savedGenerals.push(general))
	}
	// Make a move.
	
	while (true) {

		var is50 = false

		if (pathToTarget.length > 0 && terrain[newArmyIndex] === playerIndex){
			var next = pathToTarget.shift()
			console.log(`-- ${data.turn} --`)
			console.log(`I have saved moves from a previous target. Moving from: ${newArmyIndex} to ${next}`)
			socket.emit('attack', newArmyIndex, next, is50)
			newArmyIndex = next
			break
		} else {
			// Pick a random tile.
			// Find all my tiles
			var myOccupiedTerrain = []
			var enemyTerrain = []
			terrain.forEach((el, idx) => {
				if(el === playerIndex){
					myOccupiedTerrain.push(idx)
				}
			})
			terrain.forEach((el, idx) => {
				if(el > -1 && el !== playerIndex && teams[el] !== myTeam){
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
			terrain[newArmyIndex] === playerIndex && armies[newArmyIndex] > 1 ? biggestArmyIndex = newArmyIndex : null
			var index = armies[myMove] > 1 ? myMove : biggestArmyIndex
			console.log('armies', armies[myMove], 'index', index)
			var options = possibleMovesFromLocation(index)
			var getTheGeneral = false
			var getTheArmy = false
			var getTheCity = false
			var smallestEnemyArmy
			var visibleCities
			var targetVisibleCity = []
			if(enemyGenerals[0]){
				getTheGeneral = enemyGenerals[0]
			}
			if(cities.length > 0 && myOccupiedTerrain.length > 8){
				visibleCities = cities.slice()
				for(let i = 0; i < visibleCities.length; i++){
					if(terrain[visibleCities[i]] === playerIndex){
						visibleCities.splice(i, 1, 'Player Controlled')
					}
				}
				visibleCities.forEach(city => {
					if (city !== 'Player Controlled'){
						targetVisibleCity.push(city)
					}
				})
			}
			
			if(targetVisibleCity[0]){
				getTheCity = targetVisibleCity[0]
			}
			
			if(enemyTerrain[0]){
				smallestEnemyArmy = armies[enemyTerrain[0]]
				getTheArmy = enemyTerrain[0]
				
				enemyTerrain.forEach(el => {
					if(armies[el] < smallestEnemyArmy){
						smallestEnemyArmy = armies[el]
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
			var decision
			if (getTheGeneral) {
				pathToTarget = findMyPath(terrain, index, getTheGeneral).splice(1)
				myMove = pathToTarget[0]
				decision = 'general'
			} else if (getTheArmy){
				pathToTarget = findMyPath(terrain, index, getTheArmy).splice(1)
				// pathToTarget.length > 8 ? pathToTarget.splice(6) : pathToTarget.splice(4)
				myMove = pathToTarget[0]
				decision = 'army'
			} else if (getTheCity && myOccupiedTerrain.length > 10 && armies[index] > 10) {
				pathToTarget = findMyPath(terrain, index, getTheCity).splice(1)
				// pathToTarget.length > 8 ? pathToTarget.splice(6) : pathToTarget.splice(4)
				myMove = pathToTarget[0]
				decision = 'city'
			} else if (targetOptions.length > 0) {
				myMove = targetOptions[Math.floor(Math.random() * targetOptions.length)]
				decision = 'target tile'
			} else if(preferredOptions.length > 0){
				myMove = preferredOptions[Math.floor(Math.random() * preferredOptions.length)]
				decision = 'preferred tile'
			} else {
				myMove = viableOptions[Math.floor(Math.random() * viableOptions.length)]
				decision = 'last resort tile'
			}
			
			if (myGeneralLocation === index){
				is50 = true
			}
			pathToTarget.shift()
			newArmyIndex = myMove
			console.log(`-- ${data.turn} --`)
			console.log('I can see the following cities:', visibleCities, 'I may target cities at', targetVisibleCity, 'I can see a general at', getTheGeneral || "none")
			console.log(`My path is ${pathToTarget || '(No path currently)'}`)
			console.log(`I'm moving my army from ${index} to ${myMove}. This choice was made to go after a(n) ${decision}`)

			socket.emit('attack', index, myMove, is50)
			
			break;
		}
	}
});
	
	function leaveGame() {
	socket.emit('leave_game');
}

socket.on('game_lost', leaveGame);

socket.on('game_won', leaveGame);