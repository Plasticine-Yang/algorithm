/**
 * @description 方法一 -- 暴力递归
 */
const solution1 = (nums: number[], target: number): number => {
  // 定义递归函数：从 nums[idx...] 开始，求出 target 有多少种方式
  const traverse = (nums: number[], idx: number, target: number): number => {
    // base case
    if (idx === nums.length) {
      return target === 0 ? 1 : 0
    }

    // 两种途径得到目标和 -- nums[idx] 取正和取负
    return (
      traverse(nums, idx + 1, target - nums[idx]) +
      traverse(nums, idx + 1, target + nums[idx])
    )
  }

  // 从 nums[0...] 开始，求出目标和为 target 的方法总数
  return traverse(nums, 0, target)
}

/**
 * @description 方法二 -- 记忆化搜索优化
 */
const solution2 = (nums: number[], target: number): number => {
  // 定义递归函数：从 nums[idx...] 开始，求出 target 有多少种方式
  const traverse = (
    nums: number[],
    idx: number,
    target: number,
    memo: Map<number, Map<number, number>>,
  ): number => {
    // base case
    if (idx === nums.length) {
      return target === 0 ? 1 : 0
    }

    // 查询缓存表
    if (!memo.has(idx)) {
      memo.set(idx, new Map())
    }

    const targetMap = memo.get(idx)!

    if (targetMap.has(target)) {
      // 缓存命中
      return targetMap.get(target)!
    }

    // 计算结果
    const res: number =
      traverse(nums, idx + 1, target - nums[idx], memo) +
      traverse(nums, idx + 1, target + nums[idx], memo)

    // 将结果存入缓存
    targetMap.set(target, res)

    return res
  }

  return traverse(nums, 0, target, new Map())
}
