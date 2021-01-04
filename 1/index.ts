import { default as List } from './data.json'

const data: number[] = List

const part1 = (list: number[]): [number, number] | undefined => {
  while(list.length) {
    const i: number = list.shift()!
    const j: number[] = list.filter(k => (i! + k === 2020))
    if (j.length) {
      return [i, j[0]]
    }
  }
}

const part2 = (list: number[]): [number, number, number] | undefined => {
  while(list.length) {
    const i: number = list.shift()!

    const innerList: number[] = [...list]
    while(innerList.length) {
      const j: number = innerList.shift()!
      const k: number[] = innerList.filter(l => (i! + j! + l === 2020))
      if (k.length) {
        return [i, j, k[0]]
      }
    }
  }
}

export default {
  part1,
  part2
}
const resultPart1: [number, number] | undefined = part1([...data])
const resultPart2: [number, number, number] | undefined = part2([...data])


console.log(`Result: 1 = ${JSON.stringify(resultPart1)}`)
console.log(`Result: 1 = ${(resultPart1 && resultPart1.length > 1) && resultPart1[0] * resultPart1[1]}`)
console.log(`Result: 2 = ${JSON.stringify(resultPart2)}`)
console.log(`Result: 2 = ${(resultPart2 && resultPart2.length > 2) && resultPart2[0] * resultPart2[1] * resultPart2[2]}`)
