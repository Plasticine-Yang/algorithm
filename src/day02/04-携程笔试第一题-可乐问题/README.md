# 题目描述

> 贩卖机只支持硬币支付，且收退都只支持 10, 50, 100 三种面额
>
> 一次购买只能出一瓶可乐，且投钱和找零都遵循优先使用大钱的原则
>
> 需要购买的可乐数量是 m,
>
> 其中手头拥有的 10、50、100 的数量分别为 a、b、c
>
> 可乐的价格是 x(x 是 10 的倍数)
>
> 请计算出需要投入硬币次数？

# 举例厘清题意

这是`2020年携程秋招笔试`中的第一道算法题，让我们先来厘清一下题意

假设题目中的数据如下：

- 10 元面额的硬币 -- `a = 5000`
- 50 元面额的硬币 -- `b = 20`
- 100 元面额的硬币 -- `c = 30`
- 可乐单价 -- `x = 2350`
- 需要购买的可乐数量 -- `m = 20`

根据题意，我们优先使用最大面额的硬币，也就是`100元`的硬币去购买，那么需要`Math.ceil(2350 / 100) === 24`个才行

那么投了 24 个 100 元硬币后，机器需要找零`2400 - 2350 = 50`元回来，同样地，找零的时候也是大面额的硬币优先，所以机器会退回一个 50 元硬币给我

那么此时我的硬币情况为：

- 10 元面额的硬币 -- `a = 5000`
- 50 元面额的硬币 -- `b = 21`
- 100 元面额的硬币 -- `c = 6`

这只买了第一瓶可乐，还剩下 19 瓶要买呢

由于`100元`的硬币只剩下 6 个，显然是不够 24 个的，这时候就需要考虑下一个面值的硬币，也就是`50元`

需要多少个`50元`的硬币呢？类似地，需要`Math.ceil((2350 - 100 * 6) / 50) === 35`个才行

同样由于`50元`硬币只有 21 个，还是不够买一瓶可乐，那么就得再使用`10元`硬币了

类似地，需要`Math.ceil((2350 - 100 * 6 - 50 * 21) / 10) === 70`个硬币

也就是说买第二瓶可乐我们投了`6 + 21 + 70 === 97`次硬币

接下来还剩下 18 瓶可乐，因为 100 和 50 的硬币都用完了，接下来直接全部用 10 元硬币买即可

一共需要投`Math.ceil(2350 * 18 / 10) === 4230`个 10 元硬币

因此购买 20 瓶可乐我们总共要投`24 + 97 + 4230 === 4351`次硬币，题目就是要我们求这个投币次数的

# 单元测试

由于没有实际的 OJ 平台，所以在理解了题目的意思后我们首先就来编写一个相应的单元测试，方便后续对算法实现进行验证

```ts
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
})
```

# 思考实现

相信看完上面的举例大家都理解这道题目的意思了，那么该如何通过代码去实现呢？

从上面的举例中其实我们就能发现一点端倪了，我们只需要在使用初次使用的面额去购买可乐时做一些特别处理即可，后续如果能够继续使用该面额的硬币购买可乐的话则直接做一个除法向上取整就可以知道需要投多少次该面额的硬币了

但是也会遇到当前面值的硬币不够用的情况，那么这时候就触发使用下一个面值的硬币的时机，当前面额的硬币作为历史转移到下一面额硬币购买第一瓶可乐使用，这时候由于是使用新面额购买该面额下的第一瓶可乐，所以只需要再用我们说的特殊处理去处理一下即可

那么特殊处理是什么呢？

还是拿上面的例子来说，当我们第一次使用 100 元面额的硬币购买可乐时，由于是第一次使用 100 元面额，并且买的是该面额下的第一瓶可乐，所以我们要看看有没有上一个面额遗留给我们的“历史信息”，特殊处理就特殊在这里了，但是 100 元硬币是第一个面额，没有之前的面额的历史遗留信息供我们使用，因此可以直接进行计算，求出 100 元硬币全部花完可以买几瓶可乐

30 个 100 元硬币只能够买一瓶可乐，剩下的 650 将会作为“历史信息”转移到下一个面额买第一瓶可乐时的特殊处理中使用

下一个面额是 50 元硬币，在用 50 元硬币买该面额下的第一瓶可乐时，要检查是否有前一个面额的“历史信息”，前一个面额遗留了 650 元下来，因此我们计算第一瓶可乐时就要特殊处理，先计算第一瓶可乐的消费情况（即要支付多少，以及找零后的情况），然后后续的支付就可以完全使用 50 元面额去支付了

但是由于 50 元硬币加上 100 元硬币的“历史信息”也依然完全不够支付第一瓶可乐，所以 50 元面额也要作为“历史信息”，转移给下一个面额 -- 10 元硬币去处理

当我们来到 10 元面额的硬币时，首先计算用它买第一瓶可乐的消费情况，需要先找到“历史信息”，包括 6 个 100 元硬币以及 21 个 50 元硬币，因此“历史信息”为`1650元 27(6 + 21)次投币`

得知这个“历史信息”后，利用它计算出 10 元面额硬币买第一瓶可乐的投币次数，剩下的可乐的购买就直接完全用 10 元硬币去购买即可，也就是一个向上取整的除法计算而已

综上，买 m 瓶可乐的投币次数的计算其实只和硬币面额的种树有关系，而题目限制了面额一共就 3 种，所以无论问题规模`m`有多大，我们的算法核心流程就是一个 3 次的循环而已，其中做的一些操作也不过是除法之类的简单计算，因此整体的时间复杂度最终是`O(1)`

明白了思路后写代码就容易多了，这题就是一个考察`coding`能力的题，考察你能否对场景的流程进行还原，并没有涉及到什么像动态规划、回溯算法等有套路的算法，因此遇到这种题的时候不用慌，冷静下来厘清楚流程是关键，接下来我们来看看代码

# 代码实现

```ts
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
      res += coinCountToBuyRestCola
      break
    }
  }

  return res
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
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86eb8783567946b29d1f47d45ae35f0f~tplv-k3u1fbpfcp-watermark.image?)

可以看到通过了`happy path`单元测试，但是这还不够，这只是针对我们目前的这个举例场景下能通过，我们还要验证一下任意场景下是否都能通过

这就要先去写一个暴力解法，然后再生成一些随机数据去验证了

那么暴力解法怎么写呢？

# 用暴力解法验证算法正确性

暴力解法的思路就是模拟一瓶一瓶购买的过程，严格按照投币，找零的流程不断运行，直到买满 m 瓶可乐为止

```ts
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
    }

    // 投一次币
    coinsCount[targetDenominationIdx]--

    // 递归购买 x - 当前投币的面额后的可乐 求出投币次数
    const nextPuts = buySingleCola(
      coinsCount,
      coinsDenomination,
      x - coinDenomination,
    )

    // 当前投币次数加上后续投币次数即为购买一瓶可乐的投币次数
    return nextPuts === -1 ? -1 : 1 + nextPuts
  }

  while (m != 0) {
    // 计算投币次数
    const puts = buySingleCola(coinsCount, coinsDenomination, x)

    res += puts
    m--
  }

  return res
}
```

我们用同样的例子来测试一下这个暴力解法是否正确

```ts
test('使用暴力解进行验证', () => {
  const a = 5000
  const b = 20
  const c = 30
  const m = 20
  const x = 2350

  const res = validateSolution(a, b, c, m, x)
  expect(res).toBe(4351)
})
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e549c8d347e40ccb947ff98f50dafa5~tplv-k3u1fbpfcp-watermark.image?)

可以看到也是通过的，那么接下来就可以使用这个暴力解法去验证我们的算法正确性了

```ts
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
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f38023c6af6451bb075d5d49df785cc~tplv-k3u1fbpfcp-watermark.image?)

对于随机数据也是可以通过，说明算法正确
