import Controls from '@/components/Controls'
import { Game } from '@/models/game'
import { mount } from '@vue/test-utils'
import { ace, suits } from '@/models/card'

let game
let trick

beforeEach(() => {
  game = new Game()
  trick = game.currentTrick
})

describe('Controls.vue', () => {
  test('should render next button if trick is finished', () => {
    trick.add(ace.of(suits.hearts), game.players[0])
    trick.add(ace.of(suits.hearts), game.players[1])
    trick.add(ace.of(suits.hearts), game.players[2])
    trick.add(ace.of(suits.hearts), game.players[3])

    const wrapper = mount(Controls, {propsData: { currentTrick: trick }})

    expect(wrapper.find('div.next').exists()).toBe(true)
    expect(wrapper.find('div.nextMove').exists()).toBe(false)
  })

  test('should not render next button if trick is empty', () => {
    const wrapper = mount(Controls, {propsData: { currentTrick: trick }})

    expect(wrapper.find('div.next').exists()).toBe(false)
    expect(wrapper.find('div.nextMove').exists()).toBe(true)
  })

  test('should emit next trick event if next button is clicked', () => {
    trick.add(ace.of(suits.hearts), game.players[0])
    trick.add(ace.of(suits.hearts), game.players[1])
    trick.add(ace.of(suits.hearts), game.players[2])
    trick.add(ace.of(suits.hearts), game.players[3])
    const wrapper = mount(Controls, {propsData: { currentTrick: trick }})

    wrapper.find('div.next').trigger('click')

    expect(wrapper.emitted().nextTrick.length).toBe(1)
  })

  test('should emit next move event if next move button is clicked', () => {
    const wrapper = mount(Controls, {propsData: { currentTrick: trick }})

    wrapper.find('div.nextMove').trigger('click')

    expect(wrapper.emitted().nextMove.length).toBe(1)
  })
})
