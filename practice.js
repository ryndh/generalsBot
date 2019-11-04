// Assuming playerIndex is 1
let mapWidth = 5
let mapHeight = 5

function getRowCol(square){
	var row = Math.floor(square / mapWidth)
	var col = square % mapWidth
	return [row, col]

}

function possibleMovesFromLocation(square, terrain){

	var [row, col] = getRowCol(square)

	var leftSquare = col > 0 ? square - 1 : -2
	var rightSquare = col < mapWidth - 1 ? square + 1 : -2
	var downSquare = row < mapHeight -1 ? square + mapWidth : -2
	var upSquare = row > 0 ? square - mapWidth : -2

	var possibleMoves = [leftSquare, rightSquare, upSquare, downSquare].filter(el => el > -1 && terrain[el] !== -2)

	return possibleMoves //As indexes
}

function moveTowardsTarget(moves, target){
  var movesCopy = moves.slice()
  moveScore = mapWidth + mapHeight
  move = movesCopy[0]
  var [targetRow, targetCol] = getRowCol(target)
  movesCopy.forEach(tile => {
    var [moveRow, moveCol] = getRowCol(tile)
    var score = Math.abs(targetRow - moveRow) + Math.abs(targetCol - moveCol)
    // console.log(`Tile: ${tile} Score: ${score} CityClosestMove: ${cityClosestMove}`)
    if (score < moveScore){
      moveScore = score
      move = tile
    }
  })
  return move
}

let terrainHard = [ -1, -1, -1, -1, -1, 
                     1,  1,  1, -2,  2,
                     1, -2, -2, -1, -2,
                     1,  1,  1, -1, -1, 
                    -1, -1, -1, -1, -1 ]

let terrainEasy = [ -1, -1, -1, -1, -1, 
                    -1, -1, -1, -1,  2,
                    -1, -1, -1, -1, -1,
                    -1,  1,  1, -1, -1, 
                    -1, -1, -1, -1, -1 ]

// destination will be index 9
// start will be index 16

function findMyPath(terrainMap, currentLocation, destination, path = [], notViable = []){
  var terrain = terrainMap
  let currentPath = path.slice()
  let wrongWay = notViable.slice()
  let potentialMoves = possibleMovesFromLocation(currentLocation, terrain)
  let filteredMoves = potentialMoves.filter(el => !wrongWay.includes(el))
  let nextMove = moveTowardsTarget(filteredMoves, destination)
  if(currentPath.includes(nextMove)){
    wrongWay.push(currentLocation)
    let whereWeWentWrong = currentPath.indexOf(nextMove)
    let updatedPath = currentPath.splice(whereWeWentWrong)
    findMyPath(terrainMap, nextMove, destination, updatedPath, wrongWay)
  }
  if(nextMove === destination){
    currentPath.push(nextMove)
  } else {
    currentPath.push(nextMove)
    findMyPath(terrainMap, nextMove, destination, currentPath, wrongWay)
  }
  return currentPath
}

console.log(findMyPath(terrainEasy, 16, 9))
// console.log(findMyPath(terrainHard, 16, 9))