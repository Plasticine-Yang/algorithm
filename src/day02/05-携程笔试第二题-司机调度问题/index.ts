export const solution = (income: number[][]): number => {
  const n = income.length

  // base case: 如果 n 是奇数 则无法将司机平分到 A 和 B 两地 无解
  if ((n & 1) !== 0) return -1

  const restA = ~~(n / 2)

  /**
   * @description 计算第 index 号司机以及其后面的司机分配完后的最高收入
   * @param income 描述每个司机去 A 和去 B 的收入
   * @param index 从第 index 号司机开始计算最高收入
   * @param restA A 地能够分配的司机数量
   */
  const calcHeightestIncomeAfterIdx = (
    income: number[][],
    index: number,
    restA: number,
  ): number => {
    // base case 1: 如果 index 已经是到 income.length 了 说明已经没有司机分配了 最高收入为 0
    if (index === income.length) return 0

    const restB = income.length - index - restA

    // base case 2: A 地分配满了 剩下的全部去 B 地
    if (restA === 0) {
      return (
        income[index][1] + calcHeightestIncomeAfterIdx(income, index + 1, restA)
      )
    }

    // base case 3: B 地分配满了 剩下的全部去 A 地
    if (restB === 0) {
      return (
        income[index][0] +
        calcHeightestIncomeAfterIdx(income, index + 1, restA - 1)
      )
    }

    // 当前司机去 A 地
    const resA =
      income[index][0] +
      calcHeightestIncomeAfterIdx(income, index + 1, restA - 1)

    // 当前司机去 B 地
    const resB =
      income[index][1] + calcHeightestIncomeAfterIdx(income, index + 1, restA)

    return Math.max(resA, resB)
  }

  return calcHeightestIncomeAfterIdx(income, 0, restA)
}
