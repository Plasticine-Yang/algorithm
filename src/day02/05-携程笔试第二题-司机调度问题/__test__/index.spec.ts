import { solution } from '..'

describe('05-携程笔试第二题-司机调度问题', () => {
  test('happy path', () => {
    const income = [
      [10, 13],
      [23, 17],
      [18, 22],
      [42, 56],
    ]

    const res = solution(income)
    const ans = 111

    expect(res).toBe(ans)
  })
})
