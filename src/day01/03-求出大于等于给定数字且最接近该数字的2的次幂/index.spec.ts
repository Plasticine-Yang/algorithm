import { solution } from './index'

describe('03-求出大于等于给定数字且最接近该数字的2的次幂', () => {
  test('happy path', () => {
    expect(solution(13)).toBe(16)
    expect(solution(23)).toBe(32)
    expect(solution(1023)).toBe(1024)
    expect(solution(-666)).toBe(1)
  })
})
