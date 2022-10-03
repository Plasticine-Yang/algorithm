import { MessageBox } from '..'

describe('03-数据乱序到达时按序输出', () => {
  let box: MessageBox<string>

  beforeEach(() => {
    box = new MessageBox()
  })

  test('数据全部按序到达', () => {
    box.receive(1, '首次击杀敌人')
    box.receive(2, '双杀')
    box.receive(3, '三杀')
    box.receive(4, '四杀')
    box.receive(5, '五杀')

    const data = box.flush()
    expect(data).toEqual(['首次击杀敌人', '双杀', '三杀', '四杀', '五杀'])
  })

  test('数据乱序到达', () => {
    box.receive(5, '五杀')
    box.receive(2, '双杀')
    box.receive(1, '首次击杀敌人')
    box.receive(4, '四杀')
    box.receive(3, '三杀')

    const data = box.flush()
    expect(data).toEqual(['首次击杀敌人', '双杀', '三杀', '四杀', '五杀'])
  })

  test('每次击杀后调用flush', () => {
    box.receive(5, '五杀')
    expect(box.flush()).toEqual([])

    box.receive(2, '双杀')
    expect(box.flush()).toEqual([])

    box.receive(1, '首次击杀敌人')
    expect(box.flush()).toEqual(['首次击杀敌人', '双杀'])

    box.receive(4, '四杀')
    expect(box.flush()).toEqual([])

    box.receive(3, '三杀')
    expect(box.flush()).toEqual(['三杀', '四杀', '五杀'])
  })
})
