<template>
  <div class="trick">
    <div class="cards">
      <transition-group name="card" tag="span">
        <Card
          v-for="playedCard in cards"
          :key="playedCard.card.cardId"
          :card="playedCard.card"
          :player-name="playedCard.player.name"
        />
      </transition-group>
    </div>
    <div v-if="winner" class="winner">
      {{ $t("trick_goes_to") }} {{ winner.name }}
    </div>
  </div>
</template>

<script>
import Card from "./Card";

export default {
  name: "Trick",
  components: {
    Card
  },
  props: {
    currentTrick: {
      type: Object,
      default: null
    }
  },
  computed: {
    cards: function() {
      return this.currentTrick.cards();
    },
    winner: function() {
      return this.currentTrick.winner();
    }
  }
};
</script>

<style scoped>
.trick {
  min-height: 180px;
  min-width: 100%;
  justify-content: center;
  align-items: stretch;
}

.winner {
  padding: 12px;
  text-align: center;
}

.cards > span {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.cards .card {
  margin: 6px;
}

.card-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 0.5s;
}

.card-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 0s;
}

.card-leave-to {
  opacity: 0;
}

.card-enter {
  opacity: 0;
  transform: scale(2, 2);
}
</style>
