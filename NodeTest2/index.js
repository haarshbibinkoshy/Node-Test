// Function to check if a position is valid on the chessboard
function isValidPosition(x, y) {
    return (x >= 0 && x < 8 && y >= 0 && y < 8);
  }
  
  // Function to get all possible moves from a given position for a Knight
  function getKnightMoves(x, y) {
    const possibleMoves = [
      {x: x+2, y: y+1},
      {x: x+2, y: y-1},
      {x: x-2, y: y+1},
      {x: x-2, y: y-1},
      {x: x+1, y: y+2},
      {x: x+1, y: y-2},
      {x: x-1, y: y+2},
      {x: x-1, y: y-2}
    ];
  
    const validMoves = possibleMoves.filter(move => isValidPosition(move.x, move.y));
  
    return validMoves;
  }

  const knightMoves = getKnightMoves(2, 2);
  console.log(`Possible moves for a Knight :`);
  console.log(knightMoves);