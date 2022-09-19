import { solution } from './index'

describe('01-选择工作问题', () => {
  test('happy path', () => {
    const hard = [1, 2, 3, 1, 4, 2, 5]
    const money = [100, 300, 800, 120, 400, 200, 900]
    const ability = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const ans = solution(hard, money, ability)

    expect(ans).toEqual([120, 300, 800, 800, 900, 900, 900, 900, 900, 900])
  })
})
