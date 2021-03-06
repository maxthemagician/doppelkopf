<template>
  <div class="table">
    <Player :player="game.players[1]" class="left" />
    <Player :player="game.players[2]" class="top" />

    <div class="center">
      <Trick :current-trick="game.currentTrick" />
    </div>

    <Controls
      :game="game"
      @nextTrick="finishTrick"
      @nextMove="nextMove"
      @finishRound="finishRound"
    />

    <Player :player="game.players[3]" class="right" />
    <Player :player="game.players[0]" class="bottom" />

    <Scorecard
      v-if="game.currentRound.isFinished()"
      :scorecard="game.scorecard"
      :players="game.players"
      :current-score="game.currentRound.score"
      @nextRound="nextRound"
    />
  </div>
</template>

<script>
import Player from "./Player";
import Trick from "./Trick";
import Controls from "./Controls";
import Scorecard from "./Scorecard";

export default {
  name: "Table",
  components: {
    Player,
    Trick,
    Controls,
    Scorecard
  },
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  methods: {
    nextMove: function() {
      this.game.currentRound.nextMove();
    },
    finishTrick: function() {
      this.game.currentRound.finishTrick();
    },
    finishRound: function() {
      this.game.currentRound.finishRound();
    },
    nextRound: function() {
      this.game.nextRound();
    }
  }
};
</script>

<style scoped>
.table {
  display: grid;
  grid-template-rows: minmax(120px, auto) 400px minmax(120px, auto) 120px;
  grid-template-areas:
    "top top top"
    "left center right"
    "left bottom right"
    "controls controls controls";
  overflow: hidden;
}
.top {
  grid-area: top;
}

.right {
  grid-area: right;
}

.center {
  grid-area: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom {
  grid-area: bottom;
}

.left {
  grid-area: left;
}

@media screen and (max-width: 680px) {
  .table {
    grid-template-columns:
      minmax(80px, auto)
      minmax(200px, auto)
      minmax(80px, auto);
    grid-template-rows:
      minmax(120px, auto)
      minmax(250px, auto)
      minmax(120px, auto)
      120px;
    grid-template-areas:
      "top top top"
      "left center right"
      "bottom bottom bottom"
      "controls controls controls";
  }
}
</style>
