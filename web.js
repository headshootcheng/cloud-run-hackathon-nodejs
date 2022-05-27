const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!!!!!!!!!');
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
  console.log(req.body);
  const {arena,_links} = req.body;
  const width = arena?.dims[0]?? 12;
  const height = arena?.dims[1]?? 9;
  const myLink =  _links?.self?.href ?? "https://cloud-run-hackathon-nodejs-h4njltnl3q-uc.a.run.app/";

  const moves = ["T", 'L', "T", 'R', "T","F"];
  const randomNum = Math.floor(Math.random())*moves.length;
  res.send(moves[Math.floor(Math.random() * moves.length)]);
});

app.listen(process.env.PORT || 8080);
