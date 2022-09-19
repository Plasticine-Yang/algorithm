# 算法场景描述

给你一个数组`arr`，里面的元素只有字符`G`和`B`，现在需要让`G`和`B`移动到两侧，可以是：

- `G`全部移动到左侧，`B`全部移动到右侧
- `G`全部移动到右侧，`B`全部移动到左侧

元素的移动只能是通过相邻元素之间进行交换实现，问最少的移动次数是多少？

比如`arr = ['B', 'B', 'G', 'G', 'G', 'B', 'G', 'B', 'B', 'G']`

如果把`G`移动到左侧，`B`移动到右侧，最少的移动次数为`14`
而如果把`B`移动到左侧，`G`移动到右侧，最少的移动次数为`11`

所以答案是`11`

# 思路分析：双指针解法 -- 贪心思想

基于贪心的思想，假设现在要将`G`移动到左侧，`B`移动到右侧，那么第一个`G`移动到下标`0`位置后，下一个`G`移动到下标`1`处就行，并不一定要求移动到下标`0`处，因为这样做并没有什么意义，反而徒增交换次数

基于这样的思想，我们可以用两个指针`p`和`q`，以`G`移动到左侧，`B`移动到右侧为例，`p`记录下一个`G`应当移动到左侧的下标，而`q`则负责遍历数组，遇到`G`就需要进行交换，但这里由于求的只是次数，所以不需要进行真正的交换，我们只需要计算以下两个指针之间的距离即代表需要交换的次数，然后累加到结果变量中即可

# 解法代码

```ts
export const solution = (arr: string[]): number => {
  // 双指针 p 和 q
  let p = 0
  let q = 0

  // 记录 G 移动到左侧，B 移动到右侧时的最少移动次数
  let res1 = 0
  // 记录 B 移动到左侧，G 移动到右侧时的最少移动次数
  let res2 = 0

  // 计算将 G 移动到左侧，B 移动到右侧时的最少移动次数
  while (q < arr.length) {
    if (arr[q] === 'G') {
      res1 += q - p
      // p 记录下一个 G 应当放置的位置
      p++
    }
    q++
  }

  // 计算将 B 移动到左侧，G 移动到右侧时的最少移动次数
  p = 0
  q = 0
  while (q < arr.length) {
    if (arr[q] === 'B') {
      res2 += q - p
      // p 记录下一个 G 应当放置的位置
      p++
    }
    q++
  }

  return Math.min(res1, res2)
}
```

# 单元测试

通过`vitest`编写一个简单的单元测试验证一下

```ts
import { solution } from './index'

describe('用最少的步数将数组中的G和B移动到两侧', () => {
  test('happy path', () => {
    const arr = ['B', 'B', 'G', 'G', 'G', 'B', 'G', 'B', 'B', 'G']
    const res = solution(arr)
    expect(res).toBe(11)
  })
})
```

# 重构优化

我们的解法代码中现在明显是有重复代码的，就是两个`while`循环，里面的代码重复率很高，可以抽离成一个函数进行优化

```ts
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
```

可以看到代码现在简洁了不少，再跑一下单元测试发现依然能够通过，说明重构没影响到原来的算法正确性，重构成功！
