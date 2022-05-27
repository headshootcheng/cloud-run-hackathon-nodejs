const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!!!!!!!!! v1' );
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
  const width = arena?.dims[0]?? 12;
  const height = arena?.dims[1]?? 9;
  const myLink =  _links?.self?.href ?? "https://cloud-run-hackathon-nodejs-h4njltnl3q-uc.a.run.app/";
  const myPosition = {x: arena.state[myLink].x, y: arena.state[myLink].y};
  const myDirection = arena.state[myLink].direction;
  const allUserPosition = Object.values(arena.state).map((player)=>({
    x: player.x,
    y: player.y
  }))
  console.log("myDirection",myDirection);
  let shouldShoot = false;
  switch(myDirection){
    case "N":{
       if(allUserPosition.some((position)=>position.x===myPosition.x && position.y - myPosition.y <=3 &&   position.y > myPosition.y ))
        shouldShoot = true;
        break;
    }
    case "S":{
      if(allUserPosition.some((position)=>position.x===myPosition.x && myPosition.y - position.y <=3 &&   position.y <  myPosition.y ))
        shouldShoot = true;
        break;
    }
    case "E": {
      if(allUserPosition.some((position)=>position.y===myPosition.y &&  position.x - myPosition.x   <=3 &&   position.x >  myPosition.x ))
        shouldShoot = true;
        break;
    }
    case "W": {
      if(allUserPosition.some((position)=>position.y === myPosition.y &&  myPosition.x - position.x <=3 && position.x <  myPosition.x ))
        shouldShoot = true;
        break;
    }
    default:
      shouldShoot = true;
  }
  const moves = ["R","L","F"];
  // const moves = ["T", 'L', "T", 'R', "T","F","T"];
  const randomNum = Math.floor(Math.random())*moves.length;
  res.send(shootShoot? "T" : moves[Math.floor(Math.random() * moves.length)]);
});

app.listen(process.env.PORT || 8080);
