# 题目描述

> 现有司机 N \* 2 人，调度中心会将所有司机平分给 A、B 两个区域
>
> 第 i 个司机去 A 可得收入为 income[i][o],
>
> 第 i 个司机去 B 可得收入为 income[i][1],
>
> 返回所有调度方案中能使所有司机总收入最高的方案，是多少钱

题目的意思不难理解，就是有偶数个司机，告诉你每个司机去 A 和去 B 分别能够获得多少钱，需要将所有司机平分到 A 和 B 区域，需要求出总收入最高的司机调度方案中获得的总收入

# 举例描述

比如现在有 4 个司机，`income`数组如下:

```ts
const income = [
  [10, 13],
  [23, 17],
  [18, 22],
  [42, 56],
]
```

因为一共有 4 个司机，所以平分后应当是去 A 的有两个司机，去 B 的有两个司机，那么谁去 A 谁去 B 才能获得最高的总收入，这个总收入是多少呢？这个就是这道题要我们求的结果

- 让 0 号司机去 A
- 让 1 号司机去 A
- 让 2 号司机去 B
- 让 3 号司机去 B

这样得到的总收入是`10 + 23 + 22 + 56 === 111`是最高收入

# 思考实现

我们要先想出一个合理的递归函数的定义，然后再按着这个定义去写出求最值的过程，这是一个比较常见的思路

我们可以定义一个递归函数:

```ts
type calcHeighestIncomeAfterIdx = (income: number[][], index: number): number
```

它的意思从函数名我们就能知道，就是求出第`index...`之后的司机调度的最高收入

假设当前我们站在第 0 号司机的角度，要求出整体的最高总收入，那么是不是就是下面这样：

```ts
Math.max(...income[0]) + calcHeightestIncomeAfterIdx(income, index + 1)
```

这样写看上去没啥问题，但是别忘了，题目要求分配给 A 和 B 两地的司机数量是一样的，也就是平分，但是目前我们的递归函数并不能记录这个状态，所以我们还要修改一下我们的递归函数定义，让它能够记录当前调用时 A 和 B 两地的可分配司机数量是多少，方便我们做出限制

于是这次我们将递归函数定义改成这样:

```ts
type calcHeightestIncomeAfterIdx = (income: number[][], index: number, restA: number, restB: number): number
```

- `restA`表示 A 地可分配司机的数量
- `restB`表示 B 地可分配司机的数量

那么仍然是站在第 0 号司机的角度，思考一下要怎么求出结果，是不是像下面这样:

```ts
// 如果第 0 号司机去 A
const resA =
  income[index][0] +
  calcHeightestIncomeAfterIdx(income, index + 1, restA - 1, restB)

// 如果第 0 号司机去 B
const resB =
  income[index][1] +
  calcHeightestIncomeAfterIdx(income, index + 1, restA, restB - 1)

// 取两地收入的最大值
return Math.max(resA, resB)
```

大体的思路已经有了，接下来我们就可以去尝试实现了，但是在实现之前，先编写一个单元测试看看，驱动我们去编写对应实现以及方便验证实现的正确性

# 单元测试

```ts
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
```

# 代码实现

```ts
export const solution = (income: number[][]): number => {
  const n = income.length

  // base case: 如果 n 是奇数 则无法将司机平分到 A 和 B 两地 无解
  if ((n & 1) !== 0) return -1

  const restA = ~~(n / 2)
  const restB = restA

  /**
   * @description 计算第 index 号司机以及其后面的司机分配完后的最高收入
   * @param income 描述每个司机去 A 和去 B 的收入
   * @param index 从第 index 号司机开始计算最高收入
   * @param restA A 地能够分配的司机数量
   * @param restB B 地能够分配的司机数量
   */
  const calcHeightestIncomeAfterIdx = (
    income: number[][],
    index: number,
    restA: number,
    restB: number,
  ): number => {
    // base case 1: 如果 index 已经是到 income.length 了 说明已经没有司机分配了 最高收入为 0
    if (index === income.length) return 0

    // base case 2: A 地分配满了 剩下的全部去 B 地
    if (restA === 0) {
      return (
        income[index][1] +
        calcHeightestIncomeAfterIdx(income, index + 1, restA, restB - 1)
      )
    }

    // base case 3: B 地分配满了 剩下的全部去 A 地
    if (restB === 0) {
      return (
        income[index][0] +
        calcHeightestIncomeAfterIdx(income, index + 1, restA - 1, restB)
      )
    }

    // 当前司机去 A 地
    const resA =
      income[index][0] +
      calcHeightestIncomeAfterIdx(income, index + 1, restA - 1, restB)

    // 当前司机去 B 地
    const resB =
      income[index][1] +
      calcHeightestIncomeAfterIdx(income, index + 1, restA, restB - 1)

    return Math.max(resA, resB)
  }

  return calcHeightestIncomeAfterIdx(income, 0, restA, restB)
}
```

![通过happy path.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/669ac49b9c634c51862a27c2df41cdb5~tplv-k3u1fbpfcp-watermark.image?)

# 递归参数优化

实际上上面的递归函数`calcHeightestIncomeAfterIdx`中的参数是有优化空间的，B 地的可分配数量可以由`当前待分配司机数量 - A 地可分配司机数量`得到的

比如一共有 10 个司机要分配，目前已经分配了 2 个司机去 B 地，那么当前待分配司机数量就是 8 个，而 A 地待分配司机数量是 5 个，所以 B 地待分配司机数量是`8 - 5 === 3`个

所以我们可以减少`restB`这个参数，优化后的实现如下：

```ts
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
```
