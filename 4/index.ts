import type { Solution } from '../index'
import fs from 'fs'

interface Passport {
  cid?: string;

  byr: string; //  (Birth Year)
  iyr: string; //  (Issue Year)
  eyr: string; //  (Expiration Year)
  hgt: string; //  (Height)
  hcl: string; //  (Hair Color)
  ecl: string; //  (Eye Color)
  pid: string; //  (Passport ID)
}

const FILENAME = 'data.txt'

class FileReader {
  filename: string
  fd: number
  
  buffer: Buffer
  bufferSize: number = 10
  
  filePos: number = 0
  bufferPos: number = 0
  bytesInBuffer: number = 0

  constructor (filename: string) {
    this.filename = filename
    this.fd = fs.openSync(`${__dirname}/${this.filename}`, 'r')
    this.buffer = Buffer.alloc(this.bufferSize)

    this.filePos = 0
    this.readIntoBuffer() // prime the buffer
  }

  readIntoBuffer (): number {
    const bytesRead: number = fs.readSync(this.fd, this.buffer, 0, this.bufferSize, this.filePos)
    
    this.bytesInBuffer = bytesRead
    this.filePos += bytesRead
    this.bufferPos = 0
    
    return bytesRead
  };

  nextLine (): string | null {
    if (this.bytesInBuffer <= 0) {
      return null
    }

    let line: string = ''
    let lineEnd: number = -1;
    const eolNotInBuffer = (): boolean => (lineEnd = this.buffer.indexOf('\n', this.bufferPos)) < 0

    while (eolNotInBuffer()) {
      line += this.buffer.toString('utf8', this.bufferPos, this.bytesInBuffer)
      const read = this.readIntoBuffer()

      // EOF
      if (read <= 0) {
        return line;
      }
    }

    line += this.buffer.toString('utf8', this.bufferPos, lineEnd)
    this.bufferPos = lineEnd + 1
    return line;
  }

  async close () {
    fs.close(this.fd, () => {})
  }
}


const getNextPassport = (reader: FileReader): Partial<Passport> | null => {
  let line: string | null
  let passport: Partial<Passport> | null = {}
  do {
    line = reader.nextLine()
    if (line === null && !Object.keys(passport).length) { // EOF
      return null
    }

    if (line?.length ?? 0 < 1) {
      const props: string[] = line?.split(/\s/) ?? []
      passport = props
        .map((prop: string) => ({ [prop.split(':')[0]]: prop.split(':')[1] }))
        .reduce((a: Partial<Passport>, b: Record<string, string>) => ({ ...a, ...b }), passport)
    }
  } while (line?.length)
  return passport
}

const validatePassport = (obj: any): obj is Passport => {
  return (obj as Passport).byr !== undefined
      && (obj as Passport).iyr !== undefined
      && (obj as Passport).eyr !== undefined
      && (obj as Passport).hgt !== undefined
      && (obj as Passport).hcl !== undefined
      && (obj as Passport).ecl !== undefined
      && (obj as Passport).pid !== undefined
}

const run = async (): Promise<number> => {
  const reader = new FileReader(FILENAME)

  let passport
  let count: number = 0
  let valid: number = 0
  while ((passport = getNextPassport(reader)) !== null) {
    const isValid: boolean = validatePassport(passport)
    // console.debug(`PASSPORT:: Valid:${isValid}`, passport, '\n')

    count += 1
    valid += isValid ? 1 : 0
  }

  // console.debug(`Number of Passports: ${count}\nValid: ${valid}`)
  return valid
}

const solution: Solution = {
  part1: () => run().then((result: number) => {
    console.log(`Result: 1 = ${JSON.stringify(result)}`)
  }),
  part2: () => run().then((result: number) => {
    console.log(`Result: 2 = ${JSON.stringify(result)}`)
  })
}

export default solution
