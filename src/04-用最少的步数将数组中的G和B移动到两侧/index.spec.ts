import { solution } from './index'

describe('用最少的步数将数组中的G和B移动到两侧', () => {
  test('happy path', () => {
    const arr = ['B', 'B', 'G', 'G', 'G', 'B', 'G', 'B', 'B', 'G']
    const res = solution(arr)
    expect(res).toBe(11)
  })
})
