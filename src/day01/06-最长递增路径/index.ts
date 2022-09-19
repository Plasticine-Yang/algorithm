/**
 * @description 方法一 -- 暴力递归
 */
export const solution1 = (matrix: number[][]): number => {
  /**
   * @description 以 matrix[row][col] 为起点得出最长递增路径
   */
  const traverse = (matrix: number[][], row: number, col: number): number => {
    const m = matrix.length
    const n = matrix[0].length
    const current = matrix[row][col]

    // 计算四个方向的最长路径 -- 注意每个方向上的 base case --> 不能越出矩阵的边界
    const up =
      row > 0 && matrix[row - 1][col] > current
        ? traverse(matrix, row - 1, col)
        : 0
    const down =
      row < m - 1 && matrix[row + 1][col] > current
        ? traverse(matrix, row + 1, col)
        : 0
    const left =
      col > 0 && matrix[row][col - 1] > current
        ? traverse(matrix, row, col - 1)
        : 0
    const right =
      col < n - 1 && matrix[row][col + 1] > current
        ? traverse(matrix, row, col + 1)
        : 0

    return Math.max(up, down, left, right) + 1
  }

  // 遍历矩阵，以每个遍历元素作为起点计算其最长递增路径，并记录最大值
  let res = 0
  const m = matrix.length
  const n = matrix[0].length

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      res = Math.max(res, traverse(matrix, i, j))
    }
  }

  return res
}

/**
 * @description 方法二 -- 记忆化搜索优化
 */
export const solution2 = (matrix: number[][]): number => {
  /**
   * @description 以 matrix[row][col] 为起点得出最长递增路径
   */
  const traverse = (
    matrix: number[][],
    row: number,
    col: number,
    dp: number[][],
  ): number => {
    const m = matrix.length
    const n = matrix[0].length
    const current = matrix[row][col]

    // 查缓存
    if (dp[row][col]) {
      return dp[row][col]
    }

    // 计算四个方向的最长路径 -- 注意每个方向上的 base case --> 不能越出矩阵的边界
    const up =
      row > 0 && matrix[row - 1][col] > current
        ? traverse(matrix, row - 1, col, dp)
        : 0
    const down =
      row < m - 1 && matrix[row + 1][col] > current
        ? traverse(matrix, row + 1, col, dp)
        : 0
    const left =
      col > 0 && matrix[row][col - 1] > current
        ? traverse(matrix, row, col - 1, dp)
        : 0
    const right =
      col < n - 1 && matrix[row][col + 1] > current
        ? traverse(matrix, row, col + 1, dp)
        : 0

    const res = Math.max(up, down, left, right) + 1

    // 更新缓存
    dp[row][col] = res

    return res
  }

  // 遍历矩阵，以每个遍历元素作为起点计算其最长递增路径，并记录最大值
  let res = 0
  const m = matrix.length
  const n = matrix[0].length
  const dp = new Array(m).fill(0).map(() => new Array(n))

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      res = Math.max(res, traverse(matrix, i, j, dp))
    }
  }

  return res
}
