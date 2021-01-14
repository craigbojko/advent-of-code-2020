import type { Solution } from '../index'
import FileReader from '../helpers/FileReader.class'

const FILENAME = 'data.txt'

interface Group {
  lines: string[];
  answerSet: Set<string>;
  answerSetUniqueSum: number;
}

const getNextGroup = (reader: FileReader) => {
  let line: string | null
  let group: Group = {
    lines: [],
    answerSet: new Set(),
    answerSetUniqueSum: -1
  }
  do {
    line = reader.nextLine()
    if (line === null) { // EOF
      return null
    }

    if (line?.length ?? 0 < 1) { // End of Group
      const chars: string[] = line?.split('') ?? []
      chars.forEach(char => group.answerSet.add(char))
      group.answerSetUniqueSum = group.answerSet.size
    } else {
      // Add line to group
      group.lines.push(line)
    }
  } while (line?.length)
  return group
}

const part1 = async (): Promise<number> => {
  const reader = new FileReader(`${__dirname}/${FILENAME}`)

  const groups: Group[] = []
  let group: Group | null
  let groupAnswerSum: number = 0
  // Read all groups into array
  while ((group = getNextGroup(reader)) !== null) {
    groups.push(group)
    groupAnswerSum += group.answerSetUniqueSum
  }

  console.debug(`Number of Groups: ${groups.length}`)
  console.debug(`Group size sum: ${groupAnswerSum}`)
  return groupAnswerSum
}

const solution: Solution = {
  part1: () => part1().then((result: number) => {
    console.log(`Result: 1 = ${JSON.stringify(result)}`)
  }),
  // part2: () => part2().then((result: number) => {
  //   console.log(`Result: 2 = ${JSON.stringify(result)}`)
  // })
}

export default solution
