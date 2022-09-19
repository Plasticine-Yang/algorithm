# 算法场景描述

> 给你一个整数数组 nums 和一个整数 target 。
>
> 向数组中的每个整数前添加  '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：
>
> 例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
>
> 返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。

什么意思呢？举个例子吧，现在有一个整数数组`nums = [1,1,1,1,1]`，还有一个整数`target = 3`

我现在希望让`nums`里的元素全部用上后能够计算出`target`出来，运算的规则可以是加法也可以是减法，那么就有下面这几种方案：

1. +1 + 1 + 1 - 1 + 1
2. +1 + 1 + 1 + 1 - 1
3. +1 + 1 - 1 + 1 + 1
4. +1 - 1 + 1 + 1 + 1
5. -1 + 1 + 1 + 1 + 1

一共五种方式，现在我们要求的就是如何求出这个`5`，也就是有几种方式可以计算出目标和`target`

# 方法一：暴力递归

首先我们定义一个递归函数，只要明确并相信递归函数的定义后，按照定义去走一定能够得到我们想要的结果

定义函数`traverse(nums: number[], idx: number, target: number)`，它的定义是：

> 从 nums[idx...] 开始，求出目标和为`target`有多少种方式

明确了定义后，我们先考虑一下`base case`是什么，很明显，当`idx`来到数组的末尾的时候，此时算法可访问的数组元素为空，那么就不可能凑出任何一种方式去得出`target`，除非`target`是`0`，那也就是有一种方法凑出`0`，因为什么也不做，空元素求和就是`0`

因此我们可以写出`base case`的代码

```ts
if (idx === nums.length) {
  return target === 0 ? 1 : 0
}
```

之后再按照我们的定义，去求出目标和，那么就要思考一下有多少种方式可以求出目标和

既然每个元素都可以加上正号或者负号，那至少也会有两种途径

假设前两次我们都取了正 1，那么此时的总和已经是 2 了，由于总的目标和是`3`，那么我们现在要求的目标和就应当是`1`

所以递归调用`traverse([1,1,1,1,1], 2, 1)`，也就是说我们可访问的数组为`[1,1,1]`，现在要在这三个里面求出目标和为`1`

- 假设`nums[idx]`取正数，那么总的目标和现在就是`3`，已经达到`target`了，于是递归调用`traverse([1,1,1,1,1], 3, 0)`
- 假设`nums[idx]`取负数，那么总的目标和现在就是`1`，尚未达到`target`，于是递归调用`traverse([1,1,1,1,1], 3, 2)`

可以看到，元素取正取负正好就是目标和的两种途径来源，所以`traverse([1,1,1,1,1], 2, 1)`等价于`traverse([1,1,1,1,1], 3, 0) + traverse([1,1,1,1,1], 3, 2)`

也就是说，`nums[idx]`取正数的时候，我们的目标和变成了`1 - 1 === 0`，而`nums[idx]`取负数的时候，我们的目标和则变成了`1 + 1 === 2`

除此之外就没有别的途径能够得到当前需要的目标和了，所以我们此时就可以开始写出最终代码了，不要再进一步往下递归，只需要按照递归函数定义去尝试递归一次就行了

```ts
/**
 * @description 方法一 -- 暴力递归
 */
export const solution1 = (nums: number[], target: number): number => {
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
```

# 方法二 -- 记忆化搜索优化

其实上面的过程中存在重复计算，这个时候我们就可以用记忆化搜索的方式，减少重复计算，也就是添加一个缓存表记录一下每次递归的计算结果，之后就可以查询这个缓存表去避免重复地计算

比如`idx === 7, target === 8`的结果为 66，而`idx === 7, target === 9`的结果为 77，那么我们的缓存表就应该设计成嵌套的`map`结构，也就是：

```ts
{
  7: {
    8: 66,
    9: 77
  }
}
```

代码如下：

```ts
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
```

# 方法三 --
