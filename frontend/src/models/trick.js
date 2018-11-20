import { find, uniqueId } from "lodash";
import { PlayedCard, beats } from "@/models/playedCard";

export class Trick {
  constructor(expectedNumberOfCards) {
    this.expectedNumberOfCards = expectedNumberOfCards;
    this.playedCards = [];
    this.finished = false;
    this.id = uniqueId("trick_");
  }

  add(card, player) {
    if (this.cardBy(player)) {
      throw Error(`Player ${player.name} already played a card`);
    }

    const playedCard = new PlayedCard(card, player);

    this.playedCards.push(playedCard);

    if (this.playedCards.length === this.expectedNumberOfCards) {
      this.finished = true;
    }
  }

  cards() {
    return this.playedCards;
  }

  cardBy(player) {
    return find(this.playedCards, { playerId: player.id });
  }

  isFinished() {
    return this.finished;
  }

  baseCard() {
    if (!this.playedCards[0]) {
      return undefined;
    }

    return this.playedCards[0].card;
  }

  winner() {
    if (!this.playedCards[0]) {
      return undefined;
    }

    const winningPlayer = this.playedCards.slice().sort(beats)[0];
    return {
      id: winningPlayer.playerId,
      name: winningPlayer.name
    };
  }

  points() {
    return this.playedCards.reduce(
      (acc, playedCard) => acc + playedCard.card.value,
      0
    );
  }
}
