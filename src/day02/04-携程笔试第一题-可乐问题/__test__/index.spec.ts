import { solution, validateSolution } from '..'

describe('04-携程笔试第一题-可乐问题', () => {
  test('happy path', () => {
    const a = 5000
    const b = 20
    const c = 30
    const m = 20
    const x = 2350

    const res = solution(a, b, c, m, x)
    expect(res).toBe(4351)
  })

  test('暴力解法', () => {
    const a = 5000
    const b = 20
    const c = 30
    const m = 20
    const x = 2350

    const res = validateSolution(a, b, c, m, x)
    expect(res).toBe(4351)
  })

  test('使用暴力解法验证算法正确性', () => {
    const a = ~~(Math.random() * 5000)
    const b = ~~(Math.random() * 50)
    const c = ~~(Math.random() * 50)
    const m = ~~(Math.random() * 50)
    const x = ~~(~~(Math.random() * 3000) / 10) * 10 // 需要保证是 10 的倍数

    const res = solution(a, b, c, m, x)
    const ans = validateSolution(a, b, c, m, x)
    expect(res).toBe(ans)
  })
})
