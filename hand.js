import { queen, suites } from './card';
import { find } from 'lodash';

export default class Hand {
    constructor(cards = []) {
        this.cards = cards;
    }

    isReh() {
        return find(this.cards, queen.of(suites.clubs));
    }

    isKontra() {
        return !this.isReh();
    }
}