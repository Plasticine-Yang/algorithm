# 题目描述

> 给定一个数组`capacity`，表示每个参赛者的能力，再给定一个非负数`k`
>
> 要求能力差值为`k`的两个参赛者才能进行比赛，已参加过比赛的选手不可再次比赛，每场比赛只有两个人
>
> 求出最多可以组织多少场比赛

比如`capacity = [1, 1, 3, 5, 7]`，`k = 2`，以数组下标来表示参赛者，那么`0 和 2`可以组织一场比赛，`3 和 4`可以组织一场比赛

当然，也可以是`2 和 3`组织一场比赛，但是这样的话最多总共只能组织一场比赛，而第一种方案最多可以组织两场比赛，因此答案为`2`

# 思考实现

## 贪心

这题我们可以基于贪心算法的思想去求解，首先将`capacity`数组升序排序，然后用一个滑动窗口去遍历数组

只要窗口内有差值为`k`的两个选手则记录为一场比赛，并且窗口两侧同时右移

当窗口内两端选手的能力差值大于`k`时，为了找出能力匹配的两个人，应当让这个差值变小，由于已经是升序排序的了，所以只需要让窗口左侧右移即可让差值变小

同理，当窗口两端选手的能力差之小于`k`时，为了找出能力匹配的两个人，应当让这个差值变大，也就是让窗口右侧右移

这种每次求解都是从能力值较小者开始依次往能力值较大者之间求差值寻找答案的思想，正是贪心的思想

如果不用贪心思想，而是随便找两个选手，差值匹配则组织比赛的话，比如上面例子中的下标为`2 和 3`的选手组织了比赛，这就导致忽略了能力较低者的一个匹配情况，应当让下标为`0 和 2`的选手比赛才更加合理，因为这样的话下标为`3 和 4`的选手才有机会组织比赛

## 暴力解法验证

当然，这样空谈而没有严格的数学证明很难说服大家认可这个思路的正确性，所以我们还需要一个暴力解法来进行验证，那么暴力解法要怎么做呢？

首先我们可以对`capacity`数组进行全排列，对每一个排列的结果从左往右进行两两配对验证，求出每个排列情况下的比赛场数的最大值，答案肯定在其中

以`capacity = [1, 3, 5, 7]`, `k = 2`举例，它的全排列结果有:

- `1, 3, 5, 7`，从左往右两两配对:
  - `1, 3`: 匹配
  - `5, 7`: 匹配
  - 总比赛场数为`2`
- `3, 1, 5, 7`，从左往右两两配对:
  - `3, 1`: 匹配
  - `5, 7`: 匹配
  - 总比赛场数为`2`
- `5, 1, 3, 7`，从左往右两两配对：
  - `5, 1`: 不匹配
  - `3, 7`: 不匹配
  - 总比赛场数为`0`
- ...

通过这样对每个排列结果进行验证，最后求出所有结果中的最大值，肯定能够得到正确答案，这是暴力解法的思路

# 单元测试

首先先编写一个`happy path`单元测试，等通过后我们再补充一个随机数据的单元测试并用暴力解法进行验证

```ts
describe('02-尽可能多地组织比赛场数', () => {
  test('happy path', () => {
    const capacity = [1, 1, 3, 5, 7]
    const k = 2
    const res = solution(capacity, k)
    const ans = 2
    expect(res).toBe(ans)
  })
})
```

# 代码实现

## 贪心滑动窗口

通过以上思路的分析，我们先来使用滑动窗口实现贪心的解法

```ts
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
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6407de412274861b22b827a84781b68~tplv-k3u1fbpfcp-watermark.image?)

可以看到通过`happy path`了，但是还不够，`happy path`中只是针对例子中的数据，我们还要用暴力算法验证下任意数据下是否也能通过

## 暴力解法验证

### 完善单元测试

首先我们补充一个单元测试，在这个单元测试里，`capacity`的数据是随机的，`k`也是随机的，并且首先通过暴力解法得到正确答案，然后再调用贪心解法得到结果，断言结果与正确答案是否匹配

```ts
test('random test case', () => {
  // 生成随机整数
  const randInt = (min: number, max: number) =>
    ~~(Math.random() * (max - min) + min)

  // capacity 数组的大小
  const capacitySize = randInt(0, 100)

  // 生成测试用例数据
  const capacity = new Array(capacitySize).fill(() => randInt(10, 30))
  const k = randInt(0, 20)

  const ans = bruteSolution(capacity, k)
  const res = solution(capacity, k)

  expect(res).toBe(ans)
})
```

### 暴力解法

```ts
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
```
