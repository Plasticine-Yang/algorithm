import { solution } from '..'

describe('02-计算排序的最少子数组元素个数', () => {
  test('happy path', () => {
    const arr = [1, 2, 6, 5, 4, 3, 8, 9]

    const res = solution(arr)

    expect(res).toBe(4)
  })
})
