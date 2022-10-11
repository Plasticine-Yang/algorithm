# 题目描述

> 给你一个二叉树的根节点 root 以及二叉树中任意一个结点 target，再给定一个数字 k
>
> 请你求出二叉树中与 target 距离为 k 的所有结点

这个题目的意思不难理解，但是有一个问题就是我们都知道二叉树只有左子节点和右子节点，如果要找出和 target 距离为 k 的所有结点，那肯定包括了 target 的父节点以及父节点的另一侧子树，也就是转成一个多叉树的遍历问题了

# 思考实现

## 如何访问父节点？

从上面的分析可以知道，我们需要让二叉树有能够访问父节点的能力，但是传统二叉树中并没有这样的能力，因此我们要想办法对其进行扩展

一个常规思路是建立一个`map`，以结点的内存地址作为`key`，并以该节点的父节点的内存地址作为`value`，这样我们在遇到任意一个结点时都能够通过这个`map`找到它的父节点

## 采用什么遍历方式更好？

前面分析已经说过了，这个问题表面上是二叉树的问题，但实际上扩展了可以获取父节点的能力后，将其转成一个多叉树的遍历问题会更加容易理解

也就是变成下图这样:

![PNG图像.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a388348a14544738156fa8d028e605f~tplv-k3u1fbpfcp-watermark.image?)

实际上就是将二叉树转成了以`target`为根节点的一个三叉树，并对其进行层序遍历，当遍历到第`k`层时将第`k`层的所有结点放到数组中返回出去即可

# 预备工作

## 层序遍历构造二叉树

还是老样子，我们先编写一个单元测试，方便之后进行验证，在这之前我们先要实现一个构造二叉树的函数，方便我们创建二叉树

```ts
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
```

## vitest 调试技巧 -- toMatchInlineSnapshot

这里推荐一个很好用的调试技巧，可以用`vitest`的`toMatchInlineSnapshot`去方便地查看我们的输出，只需要运行`npx vitest -u`开启自动更新模式，并将测试结果用`toMatchInlineSnapshot`进行断言

```ts
describe('01-找出二叉树中与target距离为k的所有结点', () => {
  test('happy path', () => {
    const res = createBinaryTree('abcdefg##hi')
    expect(res).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": "d",
          },
          "right": TreeNode {
            "left": TreeNode {
              "left": null,
              "right": null,
              "val": "h",
            },
            "right": TreeNode {
              "left": null,
              "right": null,
              "val": "i",
            },
            "val": "e",
          },
          "val": "b",
        },
        "right": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": "f",
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": "g",
          },
          "val": "c",
        },
        "val": "a",
      }
    `)
  })
})
```

每次修改代码保存后都能够立刻看到运行的结果，十分方便

![vitest调试技巧.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a98a1d8b09a740fa863fd14933b9f59c~tplv-k3u1fbpfcp-watermark.image?)

从这里的结果可以看出来我们通过层序遍历序列构造的二叉树没问题，那么就可以开始编写单元测试了

## 根据二叉树结点值查找二叉树结点

我们还需要有一个函数用于根据二叉树结点的值获取到二叉树结点(假设结点值不重复)，这是为了获取`target`结点

```ts
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
```

同样可以通过`toMatchInlineSnapshot`快速调试验证一下

```ts
describe('01-找出二叉树中与target距离为k的所有结点', () => {
  test('happy path', () => {
    // 构造二叉树
    const root = createBinaryTree('abcdefghi')
    const target = getTreeNodeByValue(root, 'b')

    expect(target).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": "h",
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": "i",
          },
          "val": "d",
        },
        "right": TreeNode {
          "left": null,
          "right": null,
          "val": "e",
        },
        "val": "b",
      }
    `)
  })
})
```

可以看到获取到的结点是正确的，那么可以把单元测试补充完整了

## 单元测试

```ts
describe('01-找出二叉树中与target距离为k的所有结点', () => {
  test('happy path', () => {
    // 构造二叉树
    const root = createBinaryTree('abcdefghi')
    const target = getTreeNodeByValue(root, 'b')

    const res = solution(root, target, 2)
    const ans = [
      getTreeNodeByValue(root, 'h'),
      getTreeNodeByValue(root, 'i'),
      getTreeNodeByValue(root, 'c'),
    ]

    // 返回的结果不需要顺序保持一致 所以使用 set 进行验证
    expect(new Set(res)).toEqual(new Set(ans))
  })
})
```

# 代码实现

注释写得很清楚了，理解了前面的思路分析很自然就能看懂，就不过多解释了

```ts
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
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb96558f37b34224a68fe72caaa24b4f~tplv-k3u1fbpfcp-watermark.image?)

顺利通过测试！
