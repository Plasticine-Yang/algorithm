# 选择工作问题

## 题目描述

> 给定数组 hard 和 money，长度都为 N
> hard[] 表示 i 号的难度，money[] 表示 i 号工作的收入
> 给定数组 ability，长度都为 M, ability[] 表示 j 号人的能力
> 每一号工作，都可以提供无数的岗位，难度和收入都一样
> 但是人的能力必须 >= 这份工作的难度，才能上班
> 返回一个长度为 M 的数组 ans, ans[j] 表示 j 号人能获得的最好收入

## 思路

1. 抽象出一个`Job`对象，用来描述每份工作的难度和对应的收入

2. 首先对所有工作进行排序，按照难度升序，难度相同的情况下按照收入降序排序
   这样做的目的是当我在面临难度相同的工作时，我直接选择第一份工作即可保证获得该难度下的最高收入

3. 维护一个`map`，以难度为`key`，收入为`value`，每个难度的工作都只保存其最高收入，而遇到更高难度的工作时，如果其收入并没有低难度的工作收入高的话则不将其加入`map`中

4. 生成这样一个`map`之后，遍历该`map`，找到难度小于等于员工能力的那份工作，即可得到其最高收入

## 代码

```ts
/**
 * @param hard 每份工作的难度数组
 * @param money 每份工作的收入数组
 * @param ability 员工的能力数组
 * @returns 每个员工能够获得的最高收入数组
 */
export const solution = (
  hard: number[],
  money: number[],
  ability: number[],
): number[] => {
  const n = hard.length

  // 1. 抽象出 Job 对象，描述每份工作的难度和收入
  interface Job {
    hard: number
    money: number
  }

  // 生成 jobs 数组
  const jobs = hard.map(
    (item, idx) =>
      ({
        hard: item,
        money: money[idx],
      } as Job),
  )

  // 2. 对 jobs 数组排序 确保获得最优收入
  jobs.sort((a, b) =>
    a.hard - b.hard === 0 ? b.money - a.money : a.hard - b.hard,
  )

  // 3. 维护一个以 Record<hard, money> 的 map，确保是按照 hard 和 money 递增的
  const map = new Map<Job['hard'], Job['money']>()

  // 第一份工作它的难度最低 薪水又是在该难度中最高的 将其加入到 map 中
  map.set(jobs[0].hard, jobs[0].money)

  // 用于记录上一次遍历的工作
  let preJob: Job = jobs[0]
  for (const job of jobs) {
    // 只有当遍历的工作它的难度和上一次遍历的工作不同 且 收入高于上一次遍历的工作时才将其加入 map
    if (job.hard !== preJob.hard && job.money > preJob.money) {
      preJob = job
      map.set(job.hard, job.money)
    }
  }

  // 4. 使用二分找到与每个员工能力最接近的那个工作难度 其收入绝对是最优的
  let ans = new Array<number>(ability.length)
  const findNearestHard = (ability: number) => {
    const arr = Array.from(map.keys())
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
      const mid = left + ((right - left) >> 2)

      if (arr[mid] < ability) {
        left = mid + 1
      } else if (arr[mid] > ability) {
        right = mid - 1
      } else {
        return arr[mid]
      }
    }

    // 当 ability 不存在于 arr 中时 返回 arr[right] 即 ability 的左侧边界
    return arr[right]
  }

  ability.forEach((item, idx) => {
    const nearestHard = findNearestHard(item)
    ans[idx] = map.get(nearestHard)!
  })

  return ans
}

// map => [[1, 120], [2, 300], [3, 800], [5, 900]]
// ability => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// ans => [120, 300, 800, 800, 900, 900, 900, 900, 900, 900]
const ans = solution(
  [1, 2, 3, 1, 4, 2, 5],
  [100, 300, 800, 120, 400, 200, 900],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
)
console.log(ans)
```

## 单元测试

```ts
describe('01-选择工作问题', () => {
  test('happy path', () => {
    const hard = [1, 2, 3, 1, 4, 2, 5]
    const money = [100, 300, 800, 120, 400, 200, 900]
    const ability = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const ans = solution(hard, money, ability)

    expect(ans).toEqual([120, 300, 800, 800, 900, 900, 900, 900, 900, 900])
  })
})
```
