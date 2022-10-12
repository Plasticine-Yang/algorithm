/**
 * @description 贪心解法 -- 滑动窗口
 * @param capacity 参赛选手能力数组
 * @param k 能力差值
 * @returns 最多可组织的比赛场数
 */
export const solution = (capacity: number[], k: number): number => {
  // 排除异常情况
  if (k < 0 || capacity.length < 2) return 0

  // 先对数组升序排序
  capacity.sort((a, b) => a - b)

  let res = 0

  // 滑动窗口两侧指针
  let left = 0
  let right = 0

  // 记录已经参加过比赛的选手的下标 -- 初始时全都没参加过 初始化为 false
  const n = capacity.length
  const visited: boolean[] = new Array(n).fill(false)

  // 滑动窗口算法
  while (left < n && right < n) {
    if (visited[left]) {
      // left 指向的参赛选手已经组织过比赛了 跳过
      left++
    } else if (right <= left) {
      // 窗口越界
      right++
    } else {
      // 计算窗口两侧的选手能力差值
      const distance = capacity[right] - capacity[left]

      // 能力差值匹配 -- 组织比赛
      if (distance === k) {
        // 只用标记 right 即可，因为 left 之后可能还会遇到这次 right 比赛过的选手
        // 而 left 比赛过的之后不可能再遇到 (因为窗口整体是往右移动的)
        visited[right] = true

        // 窗口同时右移
        right++
        left++

        // 记录比赛场次
        res++
      } else {
        distance < k ? right++ : left++
      }
    }
  }

  return res
}

/**
 * @description 暴力解法 -- 全排列
 * @param capacity 参赛选手能力数组
 * @param k 能力差值
 * @returns 最多可组织的比赛场数
 */
export const bruteSolution = (capacity: number[], k: number): number => {
  const traverse = (capacity: number[], idx: number, k: number): number => {
    let ans = 0

    if (idx === capacity.length) {
      // 两个两个配对
      for (let i = 1; i < capacity.length; i += 2) {
        if (capacity[i] - capacity[i - 1] === k) {
          ans++
        }
      }
    } else {
      for (let i = idx; i < capacity.length; i++) {
        ;[capacity[i], capacity[idx]] = [capacity[idx], capacity[i]]
        ans = Math.max(ans, traverse(capacity, idx + 1, k))
        ;[capacity[i], capacity[idx]] = [capacity[idx], capacity[i]]
      }
    }

    return ans
  }

  return traverse(capacity, 0, k)
}
