<template>
  <div class="controls">
    <button
      v-if="
        game.currentTrick.isFinished() && !game.currentRound.noMoreCardsLeft()
      "
      class="button next"
      @click="triggerNextTrick()"
    >
      {{ $t("next-trick") }}
    </button>
    <button
      v-if="
        game.currentRound.noMoreCardsLeft() && !game.currentRound.isFinished()
      "
      class="button finish"
      @click="triggerFinish()"
    >
      {{ $t("finish-round") }}
    </button>
  </div>
</template>

<script>
export default {
  name: "Controls",
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  methods: {
    triggerNextTrick: function() {
      this.$emit("nextTrick");
    },
    triggerFinish: function() {
      this.$emit("finishRound");
    }
  }
};
</script>

<style scoped>
@import "../assets/css/app.css";

.controls {
  grid-area: controls;
  text-align: center;
}
</style>
