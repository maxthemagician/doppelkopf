import { storiesOf } from "@storybook/vue";

import Scorecard from "@/components/Scorecard";
import { Player } from "@/models/player";
import { Score } from "@/models/score";
import { re, kontra } from "@/models/parties";
import { Scorecard as ScorecardModel } from "@/models/scorecard";

import "@/assets/css/app.css";

const players = [
  stubPlayer("Oswald", re, 50),
  stubPlayer("Mercedes", re, 60),
  stubPlayer("Annegret", kontra, 70),
  stubPlayer("Giovanni", kontra, 60)
];

const sc = new ScorecardModel(players);

function stubPlayer(name, party, points) {
  const stubbedPlayer = new Player(name);
  stubbedPlayer.isRe = () => party === re;
  stubbedPlayer.isKontra = () => party !== re;
  stubbedPlayer.points = () => points;
  return stubbedPlayer;
}

sc.addScore([players[0], players[2]], 3);
sc.addScore([players[2], players[3]], 2);
sc.addScore([players[0], players[2]], 4);
sc.addScore([players[2], players[0]], 1);

const score = new Score();
score.evaluate(players);

storiesOf("Scorecard", module).add("with player winning", () => ({
  components: { Scorecard },
  data() {
    return {
      scorecard: sc,
      players: players,
      score: score
    };
  },
  template:
    "<Scorecard :scorecard='scorecard' :players='players' :currentScore='score'/>"
}));
