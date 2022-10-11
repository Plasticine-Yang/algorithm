class TreeNode<T = any> {
  public left: TreeNode<T> | null
  public right: TreeNode<T> | null

  constructor(public val: T, left?: TreeNode<T>, right?: TreeNode<T>) {
    this.left = left ?? null
    this.right = right ?? null
  }
}

/**
 * @description 根据层序遍历序列构造二叉树
 * @param sequence 层序遍历序列
 */
export function createBinaryTree(sequence: string): TreeNode<string> | null {
  const process = (sequence: string, startIdx: number, endIdx: number) => {
    // base case: 越界或者遇到 # 返回 null
    if (startIdx >= endIdx || sequence.at(startIdx)! === '#') return null

    const root = new TreeNode(sequence.at(startIdx)!)

    root.left = process(sequence, 2 * startIdx + 1, endIdx)
    root.right = process(sequence, 2 * startIdx + 2, endIdx)

    return root
  }

  return process(sequence, 0, sequence.length)
}

/**
 * @description 根据结点值查找二叉树结点
 * @param root 二叉树根节点
 * @param val 要查找的值
 */
export function getTreeNodeByValue<T>(
  root: TreeNode<T> | null,
  val: T,
): TreeNode<T> | null {
  if (root === null) return null
  if (root.val === val) return root

  return (
    getTreeNodeByValue(root.left, val) ?? getTreeNodeByValue(root.right, val)
  )
}

export const solution = (
  root: TreeNode | null,
  target: TreeNode | null,
  k: number,
): TreeNode[] => {
  // 排除异常情况
  if (root === null || target === null) return []

  /**
   * @description 创建 map 用于获取结点的父结点
   */
  const createParentMap = (root: TreeNode | null) => {
    if (root === null) return null

    const parentMap = new Map<TreeNode, TreeNode | null>()

    const buildParentMap = (
      curNode: TreeNode | null,
      parentNode: TreeNode | null,
    ) => {
      // base case
      if (curNode === null) return

      // 建立 子 -> 父 映射
      parentMap.set(curNode, parentNode)

      // 递归将左子树右子树都建立映射
      buildParentMap(curNode.left, curNode)
      buildParentMap(curNode.right, curNode)
    }

    buildParentMap(root, null)

    return parentMap
  }

  const res: TreeNode[] = []

  // 构造一个 map 用于获取结点的父结点
  const parentMap = createParentMap(root)

  // 维护一个队列用于层序遍历
  const queue: TreeNode[] = []

  // 维护一个 set 用于防止重复入队
  const visited = new Set<TreeNode>()

  // 记录层数
  let level = 0

  // target 作为根节点
  queue.push(target)
  visited.add(target)

  while (queue.length !== 0) {
    // 每次循环处理一层结点
    let curLevelLength = queue.length

    while (curLevelLength-- > 0) {
      // 依次取出当前层的结点
      const node = queue.shift()!

      // 有左入左 有右入右
      if (node.left !== null && !visited.has(node.left)) {
        queue.push(node.left)
        visited.add(node.left)
      }

      if (node.right !== null && !visited.has(node.right)) {
        queue.push(node.right)
        visited.add(node.right)
      }

      // 有父入父
      const parentNode = parentMap?.get(node)
      if (parentNode && !visited.has(parentNode)) {
        queue.push(parentNode)
        visited.add(parentNode)
      }

      // 到达第 k 层时记录结果
      if (level === k) {
        res.push(node)
      }
    }

    // 已经到达第 k 层 无需继续遍历
    if (level === k) break

    // 进入下一层
    level++
  }

  return res
}
