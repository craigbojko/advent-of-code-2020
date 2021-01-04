import fs, { ReadStream } from 'fs'
import rl, { Interface } from 'readline'

interface Rule {
  x: number;
  y: number;
  char: string;
}

interface Record {
  rule: Rule;
  password: string;
}

const FILENAME = 'data.txt'
const readFile = (): Interface => {
  try {
    const stream: ReadStream = fs.createReadStream(`${__dirname}/${FILENAME}`)
    const readInterface: Interface = rl.createInterface(stream)
    return readInterface
  } catch (e) {
    console.error(e.message)
    throw e
  }
}

const parse = async (stream: Interface): Promise<Record[]> => {
  const map: Record[] = []
  for await (const line of stream) {
    const parts: string[] = line.split(':')
    const rules: string[] = parts[0].trim().split(' ')
    const password: string = parts[1].trim()
    const rule: Rule = {
      x: parseInt(rules[0].split('-')[0]),
      y: parseInt(rules[0].split('-')[1]),
      char: rules[1]
    }
    map.push({
      rule,
      password
    })
  }
  return map
}

const load = async (): Promise<Record[]> => {
  const stream = readFile()
  const map = await parse(stream)
  return map
}

const valid1 = (rule: Rule, password: string): boolean => {
  const numberOfCharRule: number = password.split('').filter(c => rule.char === c).length
  return numberOfCharRule <= rule.y && numberOfCharRule >= rule.x
}
const valid2 = (rule: Rule, password: string): boolean => {
  const pos1: string = password.charAt(rule.x - 1)
  const pos2: string = password.charAt(rule.y - 1)

  /*
  XOR logic
  0 0 = false
  0 1 = true
  1 0 = true
  1 1 = false
  */
  const result: boolean = (pos1 === rule.char || pos2 === rule.char) && !(pos1 === rule.char && pos2 === rule.char)
  return result
}

const run = async (validation: Function): Promise<number> => {
  const records: Record[] = await load()
  let validPasswords: number = 0

  records.forEach(record => {
    const isValid: boolean = validation(record.rule, record.password)
    if (isValid) {
      validPasswords += 1
    }
  })
  return validPasswords
}

export default {
  run
}

run(valid1).then((result: number) => {
  console.log(`Result: 1 = ${JSON.stringify(result)}`)
})
run(valid2).then((result: number) => {
  console.log(`Result: 2 = ${JSON.stringify(result)}`)
})
