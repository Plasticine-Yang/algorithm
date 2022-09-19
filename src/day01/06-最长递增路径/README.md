# 算法场景描述

> 给定一个  m x n 整数矩阵  matrix ，找出其中 最长递增路径 的长度。
>
> 对于每个单元格，你可以往上，下，左，右四个方向移动。 不能 在 对角线 方向上移动或移动到 边界外（即不允许环绕）。

也就是说我们要在一个二维数组中找出一条递增的路径，并且这条路径上的元素个数要是最多的，我们要求的就是这个路径中元素的个数

# 思路分析

首先能够想到的就是暴力递归，遍历二维数组每个元素，以当前遍历元素作为起点，然后不停地计算如果走上下左右四个方向，哪个方向得到的结果会是最长的路径，将它作为本次路径选择的最优解，之后不断重复这样的计算过程，直到路径来到二维数组的边缘为止

# 解法一 -- 暴力递归

根据上面的思路分析，我们不难得出下面的代码，在一个递归函数`traverse`中去不断地前进，这个函数的定义就是以数组的`row, col`元素为起点，计算出得到的最长递增路径长度

然后我们对四个方向都依次递归调用`traverse`函数，取四个方向中的最大值作为结果，后续过程以同样方式处理即可得到最终答案

```ts
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
```

这种方式虽然理论上正确，但是并不能通过力扣的判题系统，会提示超时，因为其中存在大量的重复计算，这时候我们可以用记忆化搜索优化一下

# 方法二 -- 记忆化搜索优化

所谓记忆化搜索本质上就是加入缓存表，利用空间去换时间，减少不必要地重复计算，缓存表我们一般用`Map`实现，但是这里由于我们要同时用到`row`和`col`作为`key`去取缓存结果，所以更适合用`dp`数组的方式作为缓存表

代码如下

核心代码仍然是上面方法一的代码，但是我们要在一些地方“动手脚“，加上读取缓存和更新缓存的代码

```ts
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
```

就如上面代码中注释的，只要加上相应的读取缓存和写入缓存的代码即可，大大节省时间上的不必要消耗
