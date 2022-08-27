# 统计文件系统中的文件数

给定一个路径，实现一个算法统计该路径下的文件数以及文件夹里的文件数，文件夹不算做文件数

## 前置知识点 -- node 文件操作 api

`readdir` -- 读取指定目录下的文件和文件夹

```ts
import { readdir } from 'node:fs/promises'

const path = '.'
try {
  const files = await readdir(path)
  for (const file of files) console.log(file)
} catch (err) {
  console.error(err)
}
```

`stat` -- 检查是否是文件或文件夹

```ts
import { stat } from 'node:fs/promises'

try {
  const res = await stat('./README.md')
  console.log(res.isFile())
  console.log(res.isDirectory())
} catch (err) {
  console.error(err)
}
```
