<template>
  <div class="scorecard">
    <h1 class="message">{{ $t(message) }}</h1>

    <div class="parties">
      <div class="party-wrapper">
        <div v-if="currentScore.winningParty() === 'Re'" class="winner-balloon">
          🎈 {{ $t("winner") }}
        </div>
        <div class="party-bubble">
          <div class="party re">
            Re
          </div>
          <div class="names">
            {{ partyMembers("Re") }}
          </div>
        </div>
      </div>

      <div class="party-wrapper">
        <div
          v-if="currentScore.winningParty() === 'Kontra'"
          class="winner-balloon"
        >
          🎈 {{ $t("winner") }}
        </div>
        <div class="party-bubble">
          <div class="party kontra">
            Kontra
          </div>
          <div class="names">
            {{ partyMembers("Kontra") }}
          </div>
        </div>
      </div>
    </div>

    <div class="meter">
      <PointMeter
        :re-points="currentScore.rePoints"
        :kontra-points="currentScore.kontraPoints"
      />
    </div>

    <div class="row">
      <div class="column">
        <h2>{{ $t("results") }}</h2>

        <div class="row">
          <table>
            <tr>
              <th>
                <div class="summary">
                  <strong>Re</strong>
                </div>
              </th>

              <th>
                <div class="summary">
                  <strong>Kontra</strong>
                </div>
              </th>
            </tr>
            <tr>
              <td class="extras re">
                <ul>
                  <li
                    v-for="extra in currentScore.listExtras('Re')"
                    :key="extra"
                  >
                    <span :title="$t(extra + '_description')">
                      <Icon name="info" />
                    </span>
                    {{ $t(extra) }}
                  </li>
                </ul>
              </td>
              <td class="extras kontra">
                <ul>
                  <li
                    v-for="extra in currentScore.listExtras('Kontra')"
                    :key="extra"
                  >
                    <span :title="$t(extra + '_description')">
                      <Icon name="info" />
                    </span>
                    {{ $t(extra) }}
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="sum re">
                <span v-if="currentScore.winningParty() === 'Re'"
                  >{{ currentScore.points() }} {{ $t("points") }}</span
                >
              </td>
              <td class="sum kontra">
                <span v-if="currentScore.winningParty() === 'Kontra'">
                  {{ currentScore.points() }} {{ $t("points") }}
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="column">
        <h2>{{ $t("points") }}</h2>
        <table>
          <tr>
            <th
              v-for="player in players"
              :key="player.id"
              class="player right-aligned"
            >
              {{ player.name }}
            </th>
            <th class="right-aligned">{{ $t("points") }}</th>
          </tr>
          <tr
            v-for="(scoreLine, index) in scorecard.scoreLines"
            :key="scoreLine.id"
            class="scoreLine"
            :class="{ bold: isLastLine(index) }"
          >
            <td
              v-for="player in players"
              :key="player.id"
              class="right-aligned"
            >
              {{ scoreLine.totalPoints[player.id] }}
            </td>
            <td class="right-aligned">
              {{ scoreLine.points }}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="button-row">
      <button class="button next-round" @click="triggerNextRound">
        {{ $t("next-round") }}
      </button>
    </div>
  </div>
</template>

<script>
import { includes, join } from "lodash-es";
import PointMeter from "./scorecard/PointMeter";
import Icon from "./Icon";

export default {
  name: "Scorecard",
  components: {
    PointMeter,
    Icon
  },
  props: {
    scorecard: {
      type: Object,
      required: true
    },
    players: {
      type: Array,
      required: true
    },
    currentScore: {
      type: Object,
      required: true
    }
  },
  computed: {
    message: function() {
      return includes(this.currentScore.winner(), this.players[0])
        ? "you_win"
        : "you_lose";
    }
  },
  methods: {
    triggerNextRound: function() {
      this.$emit("nextRound");
    },
    isLastLine(index) {
      return index === this.scorecard.scoreLines.length - 1;
    },
    partyMembers: function(party) {
      return join(
        this.currentScore.parties[party].map(player => player.name),
        " & "
      );
    }
  }
};
</script>

<style scoped>
@import "../assets/css/vars.css";

.scorecard {
  font-family: sans-serif;
  text-align: left;
  background: white;
  padding: 24px;
  margin: 6px;
  border-radius: 6px;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 24px;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  margin-left: auto;
  margin-right: auto;
  width: 66%;
  max-height: 90%;
  color: var(--blue);
  overflow-y: auto;
}

h1,
h2,
h3 {
  text-align: center;
  margin-bottom: 32px;
}

.scorecard table {
  text-align: left;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

th,
td {
  line-height: 2em;
}

.summary {
  display: inline-block;
}

.player {
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-aligned {
  text-align: right;
}

.bold {
  font-weight: bold;
}

.button-row {
  margin-top: 32px;
  text-align: right;
}

.extras {
  line-height: 1.5em;
}

.extras ul {
  padding-left: 0;
  list-style: circle inside;
}

.sum {
  border-top: 1px solid var(--cyan);
  padding: 6px 0;
  text-align: left;
  width: 100%;
}

.parties {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 12px;
}

.party-wrapper {
  display: inline-flex;
  flex-direction: column;
}

.winner-balloon {
  padding: 4px 12px;
  font-weight: bold;
}

.party-bubble {
  display: inline-flex;
  align-items: center;
  margin: 8px;
}

.party {
  padding: 6px 18px;
  border-radius: 18px;
  z-index: 1;
  font-weight: bold;
}

.names {
  padding: 6px 12px 6px 32px;
  background-color: var(--lightgray);
  border-radius: 18px;
  margin-left: -24px;
  z-index: 0;
}

.party.re {
  background-color: var(--lightblue);
  color: var(--white);
}

.party.kontra {
  background-color: var(--cyan);
}

.meter {
  padding: 12px 0;
}

li {
  line-height: 2.4em;
}

@media screen and (max-width: 960px) {
  .scorecard {
    width: 92%;
  }
}
</style>
