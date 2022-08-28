export const solution = (arr: string[]): number => {
  // 遍历数组计算答案
  const calcRes = (target: string) => {
    let p = 0
    let q = 0
    let res = 0

    while (q < arr.length) {
      if (arr[q] === target) {
        res += q - p
        // p 记录下一个 G 应当放置的位置
        p++
      }
      q++
    }

    return res
  }

  // 计算将 G 移动到左侧，B 移动到右侧时的最少移动次数
  const res1 = calcRes('G')

  // 计算将 B 移动到左侧，G 移动到右侧时的最少移动次数
  const res2 = calcRes('B')

  return Math.min(res1, res2)
}
