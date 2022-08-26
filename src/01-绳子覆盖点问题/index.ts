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
