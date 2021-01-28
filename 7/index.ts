import type { Solution } from '../index'
import FileReader from '../helpers/FileReader.class'

const DEBUG = false
const FILENAME = 'data.txt'

type Bag = {
  colour: string;
  variant: string;
}
type InnerBag = Bag & {
  quantity: number;
}

type Rule = {
  container: Bag;
  contents: Array<InnerBag | false>;
}

type HashTable = {
  [key: string]: InnerBag[];
}

const readDataFile = (): Rule[] => {
  const reader = new FileReader(`${__dirname}/${FILENAME}`)
  const rules: Rule[] = []
  let line: string | null

  // Read file and build ruleset
  do {
    line = reader.nextLine()
    if (line?.length) {
      const rule: Rule | null = parseLine(line)
      rule && rules.push(rule)
    }
  }
  while (line?.length)

  return rules
}

const parseLine = (line: string): Rule | null => {
  try {
    const parts = line.split('contain')
    const containerParts = parts[0].trim().match(/(\w+)\s(\w+)/)
    const contentParts = parts[1].trim().split(',')
    // console.log(line, parts, containerParts, contentParts)

    const contentBags: Array<InnerBag | false> = contentParts.map((part: string) => {
      if (/no other/.test(part)) {
        return false
      }

      const matches = part.trim().match(/^(\d+)\s(\w+)\s(\w+)/)
      return {
        quantity: parseInt(matches![1], 10),
        colour: matches![3],
        variant: matches![2]
      }
    })

    const containerBag: Bag = {
      colour: containerParts![2],
      variant: containerParts![1]
    }

    return {
      container: containerBag,
      contents: contentBags
    }
  } catch (error) {
    console.error(error.message)
    return null
  }
}

const buildHashTable = (rules: Rule[]): HashTable => {
  return rules.reduce((table: HashTable, rule: Rule) => {
    const innerBags: InnerBag[] = (rule.contents.length && rule.contents[0] !== false) ? <InnerBag[]>rule.contents : []
    return {
      ...table,
      [`${rule.container.variant} ${rule.container.colour}`]: innerBags
    }
  }, {} as HashTable)
}

const recursiveCount = (hashTable: HashTable, bagType: string): number => {
    let count: number = 0
    let bag: InnerBag[] = hashTable[bagType]
    
    if (bag.length == 0) {
      return count
    } else {
      bag.forEach((subBag: InnerBag) => {
        const type = `${subBag.variant} ${subBag.colour}`
        if (type == 'shiny gold') {
          count += 1
        }
        count += recursiveCount(hashTable, type)
      })
    }
    return count
}

const filterByInnerBag = (bag: Bag, ruleSet: Rule[]): Bag[] => {
  const rules: Rule[] = ruleSet.filter((rule: Rule) =>
    rule.contents.filter((inner: InnerBag | false) => {
      // console.info(inner)
      return inner
      && inner.colour === bag.colour
      && inner.variant === bag.variant
    }).length
  )

  return rules.map(rule => rule.container)
}

const run1Recursive = async (rules: Rule[]): Promise<number> => {
  const hashTable: HashTable = buildHashTable(rules)
  // console.log(JSON.stringify(hashTable, null, 2))

  let count: number = 0
  Object.keys(hashTable).forEach((bag: string) => {
    if (recursiveCount(hashTable, bag) > 0) {
      // console.log(`${bag} bags contain at least one shiny gold bag!`)
      count += 1
    }
  })
  return count
}

const run1Iterative = async (rules: Rule[]): Promise<number> => {
  const ourBag: Bag = { colour: 'gold', variant: 'shiny' }
  const setOfBags: Set<Bag> = new Set()
  const queue: Bag[] = [ourBag]
  let currentBag: Bag | undefined
  let iteration: number = 0

  while ((currentBag = queue.shift()) !== undefined) {
    DEBUG && console.debug(`\n---\nLoop Iteration: ${iteration}`)
    iteration += 1

    const allBagsThatContainCurrentBag: Bag[] = filterByInnerBag(currentBag, rules)
    DEBUG && console.log(`Number of bags that contains: "${currentBag.variant} ${currentBag.colour}" : ${allBagsThatContainCurrentBag.length}`)
    allBagsThatContainCurrentBag.forEach(bag => {
      if (!setOfBags.has(bag)) {
        DEBUG && console.log(`Adding bag to Set: ${JSON.stringify(bag, null, 2)}`)
        queue.push(bag)
        setOfBags.add(bag)
      }
    })
  }

  return setOfBags.size
}

const run1 = async (): Promise<[number, number]> => {
  const rules: Rule[] = readDataFile()

  const iterativeResult = await run1Iterative(rules)
  const recursiveResult = await run1Recursive(rules)

  return [
    iterativeResult,
    recursiveResult,
  ]
}

const run2 = async (): Promise<number> => {
  const rules: Rule[] = readDataFile()
  const ourBag: Bag = { colour: 'gold', variant: 'shiny' }
  const queue: Bag[] = [ourBag]

  let currentBag: Bag | undefined
  let runningCount: number = 0

  while ((currentBag = queue.shift()) !== undefined) {
    const currentBagRule: Rule | undefined = rules.find((rule: Rule) => rule.container.colour === currentBag?.colour && rule.container.variant === currentBag?.variant)
    if (currentBagRule) {
      const innerBags: InnerBag[] = currentBagRule.contents.filter(bag => bag !== false) as InnerBag[]

      innerBags.forEach((innerBag: InnerBag | false) => {
        if (innerBag) {
          runningCount += innerBags.length && innerBag.quantity
          for (let i=0; i<innerBag.quantity; i+=1) {
            queue.push({
              colour: innerBag.colour,
              variant: innerBag.variant
            })
          }
        }
      })
    }
  }

  return runningCount
}

const solution: Solution = {
  part1: () => run1().then((result: [number, number]) => {
    console.log(`Result: 1 = ${JSON.stringify(result[0])}`)
  }),
  part2: () => run2().then((result: number) => {
    console.log(`Result: 2 = ${JSON.stringify(result)}`)
  })
}

export default solution
