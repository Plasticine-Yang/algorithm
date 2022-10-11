import { createBinaryTree, getTreeNodeByValue, solution } from '..'

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
