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
