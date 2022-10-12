import { bruteSolution, solution } from '..'

describe('02-尽可能多地组织比赛场数', () => {
  test('happy path', () => {
    const capacity = [1, 1, 3, 5, 7]
    const k = 2
    const ans = 2
    const res = solution(capacity, k)
    expect(res).toBe(ans)
  })

  test('random test case', () => {
    // 生成随机整数
    const randInt = (min: number, max: number) =>
      ~~(Math.random() * (max - min) + min)

    // capacity 数组的大小
    const capacitySize = randInt(0, 100)

    // 生成测试用例数据
    const capacity = new Array(capacitySize).fill(0).map(() => randInt(0, 100))
    const k = randInt(0, 20)

    const ans = bruteSolution(capacity, k)
    const res = solution(capacity, k)

    expect(res).toBe(ans)
  })
})
