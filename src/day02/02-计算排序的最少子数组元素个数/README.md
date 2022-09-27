# 题目描述

> 给你一个数组，只允许你排序这个数组的子数组一次让整体有序，求出这个子数组的元素个数的最小值

例：

1. arr = [1, 2, 6, 5, 4, 3, 8, 9] ==> res === 4
   解释： 只用排序`[6, 5, 4, 3]`这个子数组即可让整体有序，这个子数组的长度为`4`

# 思路

1. 首先从左往右遍历，找出最右边递增数组的左边界元素的下标
2. 再从右往左遍历，找出最左边递减数组的右边界元素的下标
3. 然后左右边界之间的元素个数即为答案

比如 arr = [1, 2, 6, 5, 4, 3, 8, 9] 中

从左往右遍历找出最右边递增数组`[3, 8, 9]`的左边界元素`3`的下标为`5`

从右往左遍历找出最左边递减数组`[1, 2, 6]`的右边界元素`6`的下标为`2`

最后两个下标之间的元素个数为`5 - 2 + 1 === 4`即为答案

# 代码

```ts
export const solution = (arr: number[]) => {
  // 从左往右遍历找出右边递增数组的左边界
  let max = arr.at(0)!
  let noMaxIdx = -1
  for (let i = 1; i < arr.length; i++) {
    const item = arr.at(i)!

    if (item < max) {
      noMaxIdx = i
    } else {
      max = Math.max(max, item)
    }
  }

  // 从右往左遍历找出左边递减数组的右边界
  let min = arr.at(-1)!
  let noMinIdx = arr.length - 1
  for (let i = arr.length - 2; i >= 0; i--) {
    const item = arr.at(i)!

    if (item > min) {
      noMinIdx = i
    } else {
      min = Math.min(min, item)
    }
  }

  // noMaxIdx - noMinIdx + 1 即为答案
  return noMaxIdx - noMinIdx + 1
}
```

# 单元测试

```ts
describe('02-计算排序的最少子数组元素个数', () => {
  test('happy path', () => {
    const arr = [1, 2, 6, 5, 4, 3, 8, 9]

    const res = solution(arr)

    expect(res).toBe(4)
  })
})
```
