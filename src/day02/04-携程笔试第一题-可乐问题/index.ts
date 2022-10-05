/**
 * @description 可乐问题
 * @param a 10 元硬币的数量
 * @param b 50 元硬币的数量
 * @param c 100 元硬币的数量
 * @param m 需要购买可乐的数量
 * @param x 可乐的单价
 */
export const solution = (
  a: number,
  b: number,
  c: number,
  m: number,
  x: number,
): number => {
  // 将硬币的余量放进 coins 数组中 更加语义化 提高代码可读性
  const coinsCount = [c, b, a]

  // 硬币面额 -- 方便在遍历的时候用
  const coinsDenomination = [100, 50, 10]

  // "历史信息" -- 之前面值的硬币的总币值 和 之前面值的硬币的总数量(计算投币次数时需要用到)
  const history = {
    // 之前面值的硬币的总币值
    totalCoinValue: 0,
    // 之前面值的硬币的总数量
    totalCoinCount: 0,
  }

  // 已经购买了的可乐数量
  let purchasedColaCount = 0

  let res = 0

  for (let i = 0; i < 3 && purchasedColaCount < m; i++) {
    // 当前使用的是哪个面额的硬币
    const coinDenomination = coinsDenomination.at(i)!
    // 当前面额的硬币数量有多少个
    let coinCount = coinsCount.at(i)!

    // 新面额的硬币需要 "特殊处理" -- 结合"历史信息"去购买第一瓶可乐
    if (history.totalCoinValue || history.totalCoinCount) {
      // 计算买第一瓶可乐需要多少个当前面额的硬币
      // m / n 向上取整除法 -- (m + n - 1) / n
      // 也可以直接使用 Math.ceil(m / n)
      const coinCountToBuyFirstCola = ~~(
        (x - history.totalCoinValue + coinDenomination - 1) /
        coinDenomination
      )

      if (coinCount < coinCountToBuyFirstCola) {
        // 当前面额的硬币全部花掉都不够买第一瓶可乐 -- 当前面额的硬币作为下一个面额硬币的"历史信息"
        history.totalCoinValue += coinCount * coinDenomination
        history.totalCoinCount += coinCount
      } else {
        // 投币总次数增加 coinCountToBuyFirstCola 次
        res += coinCountToBuyFirstCola + history.totalCoinCount

        // 当前面额的硬币数量减少 coinCountToBuyFirstCola 个
        coinCount = coinsCount[i] -= coinCountToBuyFirstCola

        // 已购买的可乐数量 +1
        purchasedColaCount++

        // 找零的总额
        const totalChangeToBuySingleCola =
          coinCountToBuyFirstCola * coinDenomination +
          history.totalCoinValue -
          x

        // 找零
        giveChange(coinsCount, coinsDenomination, totalChangeToBuySingleCola)

        // 买完第一瓶可乐后清空"历史信息"
        history.totalCoinCount = 0
        history.totalCoinValue = 0
      }
    }

    // 使用当前面额的剩余硬币去买后续的可乐
    // 剩余的可乐需要用多少当前面额的硬币去购买
    // 也可以是 const coinCountToBuyRestCola = Math.ceil(((m - purchasedColaCount) * x) / coinDenomination)
    const coinCountToBuyRestCola = ~~(
      ((m - purchasedColaCount) * x + coinDenomination - 1) /
      coinDenomination
    )

    if (coinCount < coinCountToBuyRestCola) {
      // 剩余的硬币不够买剩余的可乐 -- 能买多少买多少 如果有剩则作为"历史信息"
      // 可购买的可乐数量
      const availableColaCount = ~~((coinCount * coinDenomination) / x)

      if (availableColaCount === 0) {
        // 一瓶都买不了
        continue
      }

      // 购买 availableColaCount 瓶可乐花费的硬币数量
      const coinCountToBuyAvailableCola = Math.ceil(
        (availableColaCount * x) / coinDenomination,
      )

      // 当前面额的硬币需要多少个才能购买一瓶可乐
      const coinCountToBuySingleCola = Math.ceil(x / coinDenomination)

      // 购买一瓶可乐的找零总额
      const totalChangeToBuySingleCola =
        coinCountToBuySingleCola * coinDenomination - x

      // 更新购买后当前面额的硬币数量
      coinCount = coinsCount[i] -= coinCountToBuyAvailableCola

      // 找零 -- 因为可乐是一瓶一瓶买的 所以找零过程需要重复 availableColaCount 次
      giveChange(
        coinsCount,
        coinsDenomination,
        totalChangeToBuySingleCola,
        availableColaCount,
      )

      // 更新已购买的可乐数量
      purchasedColaCount += availableColaCount

      // 更新投币总次数
      res += coinCountToBuyAvailableCola

      // 如果有剩余则作为"历史信息"
      if (coinCount > 0) {
        history.totalCoinCount += coinCount
        history.totalCoinValue += coinCount * coinDenomination
      }

      // 记录完"历史信息"后 清空剩余的硬币数量
      coinsCount[i] = 0
    } else {
      // 当前面额的硬币就能够买完剩下的可乐 -- 买完后没必要再走后续的面额硬币计算了
      purchasedColaCount = m
      res += coinCountToBuyRestCola
      break
    }
  }

  console.log('purchasedColaCount', purchasedColaCount, 'm', m)
  return purchasedColaCount === m ? res : -1
}

/**
 * @description 找零钱
 * @param coinsCount 硬币数量数组
 * @param coinsDenomination 硬币面额数组
 * @param totalChange 零钱总额
 * @param giveChangeRepeatCount 找零重复多少次
 */
function giveChange(
  coinsCount: number[],
  coinsDenomination: number[],
  totalChange: number,
  giveChangeRepeatCount = 1,
) {
  for (let i = 0; i < coinsCount.length; i++) {
    // 获取当前硬币的面额
    const coinDenomination = coinsDenomination.at(i)!

    // 计算并更新找零 totalChange 的币值会有多少该面额硬币的数量
    coinsCount[i] += ~~(totalChange / coinDenomination) * giveChangeRepeatCount

    // 更新找零的总额
    totalChange %= coinDenomination
  }
}

/**
 * @description 暴力解法 -- 用于验证算法正确性
 */
export function validateSolution(
  a: number,
  b: number,
  c: number,
  m: number,
  x: number,
): number {
  const coinsCount = [c, b, a]
  const coinsDenomination = [100, 50, 10]
  let res = 0

  const buySingleCola = (
    coinsCount: number[],
    coinsDenomination: number[],
    x: number,
  ): number => {
    // 使用哪个面额的硬币
    let targetDenominationIdx: number = -1

    for (let i = 0; i < coinsCount.length; i++) {
      if (coinsCount.at(i)! !== 0) {
        // 只要有剩就用该面额的硬币
        targetDenominationIdx = i
        break
      }
    }

    // 全部面额的硬币都用完了 买不了可乐
    if (targetDenominationIdx === -1) return -1

    const coinDenomination = coinsDenomination.at(targetDenominationIdx)!
    if (coinDenomination >= x) {
      // base case: 当前面额一张就能买一瓶可乐
      coinsCount[targetDenominationIdx]--

      // 找零
      let totalChange = coinDenomination - x // 找零的面额
      for (let i = 0; i < coinsCount.length && totalChange > 0; i++) {
        // 计算并更新找零 totalChange 的币值会有多少该面额硬币的数量
        coinsCount[i] += ~~(totalChange / coinsDenomination.at(i)!)

        // 更新找零的总额
        totalChange %= coinsDenomination.at(i)!
      }

      return 1
    } else {
      // 投一次币
      coinsCount[targetDenominationIdx]--

      // 递归购买 x - 当前投币的面额后的可乐 求出投币次数
      const nextPuts = buySingleCola(
        coinsCount,
        coinsDenomination,
        x - coinDenomination,
      )

      if (nextPuts === -1) return -1

      // 当前投币次数加上后续投币次数即为购买一瓶可乐的投币次数
      return 1 + nextPuts
    }
  }

  while (m != 0) {
    // 计算投币次数
    const puts = buySingleCola(coinsCount, coinsDenomination, x)

    res += puts
    m--
  }

  return res
}
