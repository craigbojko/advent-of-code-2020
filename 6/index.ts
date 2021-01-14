import type { Solution } from '../index'
import FileReader from '../helpers/FileReader.class'

const FILENAME = 'data.txt'

interface Group {
  lines: string[];
  unionSet: Set<string>;
  unionSetSum: number;
  intersectionSet: Set<string>;
  intersectionSetSum: number;
}

const getNextGroup = (reader: FileReader) => {
  let line: string | null
  let group: Group = {
    lines: [],
    unionSet: new Set(),
    unionSetSum: -1,
    intersectionSet: new Set(),
    intersectionSetSum: -1,
  }
  do {
    line = reader.nextLine()
    if (line === null) { // EOF
      return null
    }

    if (line?.length ?? 0 < 1) { // End of Group
      // Add line to group
      group.lines.push(line)

      // Part 1
      const chars: string[] = line?.split('') ?? []
      chars.forEach(char => group.unionSet.add(char))
      group.unionSetSum = group.unionSet.size

      // Part 2
      const lineArr: string[][] = group.lines.map(line => line.split(''))
      let intersectionA: string[] = lineArr.shift()!
      let intersectionB: string[] | undefined
      while ((intersectionB = lineArr.shift()) !== undefined) {
        intersectionA = intersectionA.filter(char => intersectionB!.includes(char))
      }
      group.intersectionSet = new Set(intersectionA)
      group.intersectionSetSum = group.intersectionSet.size
    }
  } while (line?.length)
  return group
}

const run = async (): Promise<[number, number]> => {
  const reader = new FileReader(`${__dirname}/${FILENAME}`)

  const groups: Group[] = []
  let group: Group | null
  let groupUnionSum: number = 0
  let groupIntersectionSum: number = 0

  // Read all groups into array
  while ((group = getNextGroup(reader)) !== null) {
    groups.push(group)
    groupUnionSum += group.unionSetSum
    groupIntersectionSum += group.intersectionSetSum
  }

  console.debug('---')
  console.debug(`Number of Groups: ${groups.length}`)
  console.debug(`Group union size sum: ${groupUnionSum}`)
  console.debug(`Group intersection size sum: ${groupIntersectionSum}`)
  console.debug('---')
  return [groupUnionSum, groupIntersectionSum]
}

const solution: Solution = {
  part1: () => run().then((result: [number, number]) => {
    console.log(`Result: 1 = ${JSON.stringify(result[0])}`)
  }),
  part2: () => run().then((result: [number, number]) => {
    console.log(`Result: 2 = ${JSON.stringify(result[1])}`)
  })
}

export default solution
