const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!!!!!!!!! v2.2' );
});
// {
//   "_links": {
//     "self": {
//       "href": "https://YOUR_SERVICE_URL"
//     }
//   },
//   "arena": {
//     "dims": [4,3], // width, height
//     "state": {
//       "https://A_PLAYERS_URL": {
//         "x": 0, // zero-based x position, where 0 = left
//         "y": 0, // zero-based y position, where 0 = top
//         "direction": "N", // N = North, W = West, S = South, E = East
//         "wasHit": false,
//         "score": 0
//       }
//       ... // also you and the other players
//     }
//   }
// }
//F <- move Forward
// R <- turn Right
// L <- turn Left
// T <- Throw

app.post('/', function (req, res) {
  const {arena,_links} = req.body;
  const width = arena?.dims[0] ?? 12;
  const height = arena?.dims[1] ?? 9;
  const myLink =  _links?.self?.href ?? "https://cloud-run-hackathon-nodejs-h4njltnl3q-uc.a.run.app/";
  const myPosition = {x: arena.state[myLink].x, y: arena.state[myLink].y};
  const myDirection = arena.state[myLink].direction;
  const wasHit = arena.state[myLink].wasHit;

  const allUserPosition = Object.values(arena.state).map((player)=>({
    x: player.x,
    y: player.y
  }))
  let shouldShoot = false;
  const range = 3;
  switch(myDirection){
    case "S":{
      console.log("South Case")
       if(allUserPosition.some((position)=>position.x===myPosition.x && (myPosition.y- position.y) < range &&   position.y < myPosition.y ))
        shouldShoot = true;
        break;
    }
    case "N":{
      console.log("North Case")
      if(allUserPosition.some((position)=>position.x===myPosition.x &&   (position.y - myPosition.y) < range &&   position.y >  myPosition.y ))
        shouldShoot = true;
        break;
    }
    case "W": {
      console.log("West Case")
      if(allUserPosition.some((position)=>position.y===myPosition.y &&  (myPosition.x - position.x ) < range &&   position.x <  myPosition.x ))
        shouldShoot = true;
        break;
    }
    case "E": {
      console.log("East Case")
      if(allUserPosition.some((position)=>position.y === myPosition.y &&   (position.x - myPosition.x)  <range && position.x > myPosition.x ))
        shouldShoot = true;
        break;
    }
    default:
      shouldShoot = false;
  }


  let allowMoveForward = true;
  if(myPosition.x <= 2 && myDirection === "W")
    allowMoveForward = false;
  if(myPosition.x >= width-1 && myDirection === "E")
    allowMoveForward = false;
  if(myPosition.y <= 2 && myDirection === "N")
    allowMoveForward = false;  
  if(myPosition.y >= height-1 && myDirection === "S")
    allowMoveForward = false;


  console.log("myDirection",myDirection, "shouldShoot",shouldShoot, "allowMoveForward", allowMoveForward,"myPosition",myPosition,"wasHit",wasHit);
  const normalMoves = ["F","R", "F", "L", "F"];
  const limitedMoves = ["R", "L", "R"];
  const moves = allowMoveForward ? normalMoves : limitedMoves;
  // const moves = ["T", 'L', "T", 'R', "T","F","T"];
  const randomNum = Math.floor(Math.random()) * moves.length;
  res.send((!wasHit && shouldShoot)? "T" : moves[randomNum]);
});

app.listen(process.env.PORT || 8080);
