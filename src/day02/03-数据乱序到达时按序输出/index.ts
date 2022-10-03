/**
 * @description 消息链表结点
 */
class MessageNode<T> {
  constructor(public data: T, public next: MessageNode<T> | null) {}
}

export class MessageBox<T> {
  private nextMessageIdx: number
  private headMap: Map<number, MessageNode<T>>
  private tailMap: Map<number, MessageNode<T>>

  constructor() {
    // 初始数据包序列号从 1 开始
    this.nextMessageIdx = 1

    this.headMap = new Map()
    this.tailMap = new Map()
  }

  /**
   * @description 接收数据
   */
  receive(messageIdx: number, messageContent: T) {
    // 创建结点
    const messageNode = new MessageNode<T>(messageContent, null)

    if (this.tailMap.has(messageIdx - 1)) {
      // 到尾表中查看是否有以 messageIdx - 1 结尾的连续区间
      // 有的话则和它合并 将自己作为该连续区间的尾结点
      const tailNode = this.tailMap.get(messageIdx - 1)!
      tailNode.next = messageNode
      this.tailMap.delete(messageIdx - 1)
      this.tailMap.set(messageIdx, messageNode)
    } else {
      // 尾表中没有前一个序列号的结点 -- 那么自己作为头表的结点
      this.headMap.set(messageIdx, messageNode)
    }

    if (this.headMap.has(messageIdx + 1)) {
      // 到头表中查看是否有以 messageIdx + 1 开头的连续区间
      // 有的话则和它合并 将自己作为该连续区间的头结点
      const headNode = this.headMap.get(messageIdx + 1)!
      messageNode.next = headNode
      this.headMap.delete(messageIdx + 1)
      this.headMap.set(messageIdx, messageNode)
    } else {
      // 头表中没有后一个序列号的结点 -- 那么自己作为尾表的结点
      this.tailMap.set(messageIdx, messageNode)
    }
  }

  /**
   * @description 刷新已经接收到的按序数据
   */
  flush(): T[] {
    if (this.headMap.has(this.nextMessageIdx)) {
      // 有 nextMessageIdx 为头结点的连续区间时，将这个区间输出
      let pHeadNode: MessageNode<T> | null = this.headMap.get(
        this.nextMessageIdx,
      )!

      // 统计连续区间中有几个数据 方便更新 nextMessageIdx
      let dataCount = 0
      const data: T[] = []

      while (pHeadNode !== null) {
        data.push(pHeadNode.data)
        dataCount++
        pHeadNode = pHeadNode.next
      }

      // 移除头尾表中对应结点
      const tailMessageIdx = this.nextMessageIdx + dataCount - 1
      this.headMap.delete(this.nextMessageIdx)
      this.tailMap.delete(tailMessageIdx)

      // 更新 nextMessageIdx
      this.nextMessageIdx += dataCount

      return data
    }

    return []
  }
}
