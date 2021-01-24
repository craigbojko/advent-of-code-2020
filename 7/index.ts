import type { Solution } from '../index'
import FileReader from '../helpers/FileReader.class'

const DEBUG = false

const FILENAME = 'data.txt'
// const FILENAME = 'debug.txt'

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

const run = async (): Promise<number> => {
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

  // Loop through rules and calculate
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

const solution: Solution = {
  part1: () => run().then((result: number) => {
    console.log(`Result: 1 = ${JSON.stringify(result)}`)
  }),
  // part2: () => run().then((result: [number, number]) => {
  //   console.log(`Result: 2 = ${JSON.stringify(result[1])}`)
  // })
}

export default solution
