import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * @description 计算路径下的文件数量 -- 包括文件夹中的文件数量
 * @param path 路径
 */
const calcFileCount = async (path: string): Promise<number> => {
  // 读取 path 的文件
  const root = await stat(path)

  // base case
  if (!root.isFile() && !root.isDirectory()) return 0
  if (root.isFile()) return 1

  // 遇到目录则入栈 否则就统计数量
  const stack: string[] = []
  let count = 0

  // 将根目录入栈
  stack.push(path)

  while (stack.length !== 0) {
    const directory = stack.pop()!

    // 遍历目录，遇到文件就计数，遇到目录则入栈
    const files = await readdir(directory)
    for await (const file of files) {
      if ((await stat(join(directory, file))).isFile()) count++
      else if ((await stat(join(directory, file))).isDirectory()) {
        stack.push(join(directory, file))
      }
    }
  }

  return count
}

const fileCount = await calcFileCount('.')
console.log(fileCount)
