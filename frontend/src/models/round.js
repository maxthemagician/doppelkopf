import { Trick } from "@/models/trick";
import { RingQueue } from "@/models/ringQueue";
import { Score } from "@/models/score";
import { options } from "@/models/options";
import { Notifier } from "@/models/notifier";
import { DOPPELKOPF } from "@/models/extras";
import { find } from "lodash-es";

const notifier = new Notifier();

export class Round {
  constructor(players = [], game = {}, openingPlayer) {
    this.players = players;
    this.game = game;
    this.finished = false;
    this.currentTrick = this.nextTrick();
    this.score = new Score();

    this.playerOrder = new RingQueue(this.players);
    if (openingPlayer) {
      this.playerOrder.prioritize(openingPlayer);
    }
  }

  nextTrick() {
    return new Trick(this.players.length);
  }

  nextPlayer() {
    this.playerOrder.next();
  }

  waitingForPlayer() {
    return this.playerOrder.current();
  }

  nextMove() {
    if (this.waitingForPlayer().isHuman) {
      return;
    }

    if (this.currentTrick.isFinished() || this.isFinished()) {
      return;
    }

    this.waitingForPlayer().autoplay();
  }

  noMoreCardsLeft() {
    const sumCardsFn = (acc, player) => acc + player.hand.cards.length;
    const sumOfCardsLeft = this.players.reduce(sumCardsFn, 0);
    return sumOfCardsLeft === 0;
  }

  isFinished() {
    return this.finished;
  }

  async finishTrick() {
    await this.evaluateLastTrick();

    this.currentTrick = this.nextTrick();

    if (options.autoplay === true) {
      this.nextMove();
    }
  }

  async evaluateLastTrick() {
    const playerId = this.currentTrick.winner().id;
    const winner = find(this.players, { id: playerId });
    winner.win(this.currentTrick);
    this.playerOrder.prioritize(winner);
    await this.showExtras();
  }

  async showExtras() {
    for (let extra of this.currentTrick.extras()) {
      switch (extra) {
        case DOPPELKOPF:
          await notifier.flash("Doppelkopf");
          break;
      }
    }
  }

  async finishRound() {
    if (!this.noMoreCardsLeft()) {
      throw new Error(`Can't finish a round before all cards have been played`);
    }

    await this.evaluateLastTrick();

    this.currentTrick = this.nextTrick();

    this.score.evaluate(this.players);
    this.game.addScore(this.score);
    this.finished = true;
  }
}
