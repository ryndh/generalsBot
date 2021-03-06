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

// function moveTowardsTarget(moves, target, path){
//   // var movesCopy = moves.slice()
//   // moveScore = mapWidth + mapHeight
//   // move = movesCopy[0]
//   // var [targetRow, targetCol] = getRowCol(target)
//   movesCopy.forEach(tile => {
//     var [moveRow, moveCol] = getRowCol(tile)
//     var score = Math.abs(targetRow - moveRow) + Math.abs(targetCol - moveCol)
//     // console.log(`Tile: ${tile} Score: ${score} CityClosestMove: ${cityClosestMove}`)
//     if (score <= moveScore){
//       moveScore = score
//       path.includes(tile) ? null : move = tile
//     }  
//   })
//   return move
// }

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
let terrainHard2 = [ -1, -1, -1, -1, -1, 
                      1, -2,  1, -2, -1,
                      1, -2, -2, -2, -1,
                      1,  1,  1, -2,  2, 
                     -1, -1, -1, -2, -1 ]

// destination will be index 9
// start will be index 16

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

// console.log(findMyPath(terrainEasy, 16, 9))
// console.log(findMyPath(terrainHard, 16, 9))
console.log(findMyPath(terrainHard2, 19, 14))


// const teamBuilder = (studentList, teams, currentTeams = {}) => {
//   if (studentList.length > 0){
//     for (let team in [...Array(teams).keys()]){
//       let randStudent = Math.floor(Math.random() * studentList.length)
//       currentTeams[team] = currentTeams[team] ? [...currentTeams[team],studentList[randStudent]] : [studentList[randStudent]]
//       studentList.splice(randStudent, 1)
//       if(studentList.length === 0) return
//     }
//     teamBuilder(studentList, teams, currentTeams)
//   }
//   return currentTeams
// }