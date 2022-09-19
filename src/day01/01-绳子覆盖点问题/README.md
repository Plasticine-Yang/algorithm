# 算法场景描述

考虑下面这样一个问题：

> 给定一个升序数组`arr`，代表坐落在 X 轴上的点
> 给定一个正整数 K，代表绳子的长度
> 返回绳子最多压中几个点？即使绳子边缘处盖住点也算

比如下图这样：

![f1088728432476f02ec03be58b9d48a.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88bbd70310314815810a32aee193e983~tplv-k3u1fbpfcp-watermark.image?)

长度为 4 的绳子在这个数组中最多能压住 3 个点，可以是 1、2、4，也可以是 7、8、10

那么要如何通过算法去实现呢？有两种思路

# 贪心思想

我们每次让绳子的末端放到点上，然后看绳子往前覆盖能够覆盖多少个点，遍历 arr 中每个点都这样操作，每次记录并更新最大值，这样就能得到正确答案

这种思想其实就是贪心思想的一种体现，也就是我们每次都让绳子末尾压在点上，没必要让它压在一个不存在的点上，这样就能够至少确保绳子的末尾覆盖到一个点，而至于其前面能够覆盖多少个点则正常计算即可

比如现在绳子长度为 100，绳子末尾当前在数组中的 666 这一点，那么要判断他能覆盖多少点，只需要判断 666 之前有多少个元素大于等于`666 - 100`，最后再加上绳子末尾覆盖的这一个点即可得到答案

注意到题目说数组是升序的，所以寻找大于`666 - 100`的元素个数的过程可以用二分去实现，也就是找出最接近大于等于 566 的那个元素的下标，那么 666 元素所在下标与该目标下标之间的距离再加 1 即为绳子覆盖的点数，时间复杂度为`O(logN)`，由于要遍历每一个点进行这样的操作，所以最终的时间复杂度为`O(N * logN)`

代码实现如下：

```ts
/**
 * @description 贪心思想解法
 * @param arr 数组
 * @param length 绳子长度
 */
export const solution1 = (arr: number[], length: number): number => {
  /**
   * @description 使用二分法找出数组中最接近大于等于 head 的元素下标 -- 也就是寻找左侧边界 目标值为 head
   * @param arr 数组
   * @param tailIdx 绳子末尾的下标
   * @param lineHead 绳子开头
   */
  const nearestIdx = (arr: number[], tailIdx: number, lineHead: number) => {
    let left = 0
    let right = tailIdx
    let resIdx = tailIdx

    while (left <= right) {
      const mid = left + ((right - left) >> 1)
      if (arr[mid] >= lineHead) {
        resIdx = mid
        right = mid - 1
      } else {
        left = mid + 1
      }
    }

    return resIdx
  }

  // 遍历数组 将绳子末尾放到点上，寻找有多少个点是大于等于 tail - head 的
  // 也就是找出最接近 head 的右侧端点，然后用 tail - nearestIdx + 1 即为覆盖点数
  // 再求出这些覆盖的点数中最大的那个即可
  let res = 1 // 最少都会覆盖一个点 就是绳子末尾覆盖的那个点
  for (let i = 0; i < arr.length; i++) {
    const nearest = nearestIdx(arr, i, arr[i] - length)
    res = Math.max(res, i - nearest + 1)
  }

  return res
}
```

# 滑动窗口

通过一个滑动窗口向右移动，当窗口中元素的距离超出绳子大小时窗口收缩，否则窗口一直扩张，结果就是窗口移动过程中，窗口大小的最大值，这种解法由于只遍历依次数组，所以时间复杂度是`O(N)`

代码如下：

```ts
/**
 * @description 双指针解法
 * @param arr 数组
 * @param length 绳子长度
 */
export const solution2 = (arr: number[], length: number) => {
  const n = arr.length
  let left = 0
  let right = 0
  let max = 0

  while (left < n) {
    // 窗口中元素距离小于绳子长度时窗口扩张
    while (right < n && arr[right] - arr[left] <= length) right++

    // 来到这说明窗口不能再扩张了 -- 记录窗口大小
    max = Math.max(max, right - left)
    left++
  }

  return max
}
```

# 编写单元测试进行验证

首先我们要用暴力解法去验证答案的正确性，暴力解法如下：

```ts
/**
 * @description 暴力解法用于验证解法正确性
 */
export const testSolution = (arr: number[], length: number) => {
  let max = 0
  for (let i = 0; i < arr.length; i++) {
    let pre = i - 1
    while (pre >= 0 && arr[i] - arr[pre] <= length) pre--
    max = Math.max(max, i - pre)
  }

  return max
}
```

然后我们使用`vitest`进行单元测试

```ts
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
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7ffaad0a48c459fbc7dc7e626abd9e6~tplv-k3u1fbpfcp-watermark.image?)

可以看到通过了，说明解法正确
