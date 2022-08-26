import { solution1, solution2, testSolution } from './index'

// 数组的最大长度
const ARR_MAX_LENGTH = 100
// 数组元素的最大值
const ARR_EL_MAX = 1000
// 测试轮数
const TEST_COUNT = 10000

/**
 * @description 生成升序排序的数组
 * @param arrMaxLength 数组的最大长度
 * @param elMax 数组元素的最大值
 */
const generateArr = (arrMaxLength: number, elMax: number) => {
  const arr = new Array(Math.floor(Math.random() * arrMaxLength) + 1)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(Math.random() * elMax)
  }

  arr.sort((a, b) => a - b)

  return arr
}

describe('01-绳子覆盖点问题', () => {
  test('贪心解法', () => {
    for (let i = 0; i < TEST_COUNT; i++) {
      // 生成测试数据
      const arr = generateArr(ARR_MAX_LENGTH, ARR_EL_MAX)
      const length = Math.floor(Math.random() * ARR_EL_MAX) // 绳子长度

      // 调用算法验证结果
      const ans = testSolution(arr, length)
      const res = solution1(arr, length)
      expect(res).toBe(ans)
    }
  })

  test('滑动窗口解法', () => {
    for (let i = 0; i < TEST_COUNT; i++) {
      // 生成测试数据
      const arr = generateArr(ARR_MAX_LENGTH, ARR_EL_MAX)
      const length = Math.floor(Math.random() * ARR_EL_MAX) // 绳子长度

      // 调用算法验证结果
      const ans = testSolution(arr, length)
      const res = solution2(arr, length)
      expect(res).toBe(ans)
    }
  })
})
