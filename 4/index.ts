import type { Solution } from '../index'
import FileReader from '../helpers/FileReader.class'

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

const validateBYR = (byr: string): boolean => {
  const _byr: number = parseInt(byr, 10)
  return !isNaN(_byr) && _byr >= 1920 && _byr <= 2002
}
const validateIYR = (iyr: string): boolean => {
  const _iyr: number = parseInt(iyr, 10)
  return !isNaN(_iyr) && _iyr >= 2010 && _iyr <= 2020
}
const validateEYR = (eyr: string): boolean => {
  const _eyr: number = parseInt(eyr, 10)
  return !isNaN(_eyr) && _eyr >= 2020 && _eyr <= 2030
}
const validateHGT = (hgt: string): boolean => {
  if (!hgt) {
    return false
  }
  const hgtMetric: string = hgt && (!~hgt.indexOf('cm') || !~hgt.indexOf('in')) && hgt.substring(hgt.length -2, hgt.length) || ''
  const _hgt: number = parseInt(hgt.substring(0, hgt.length - 2), 10)
  if (hgtMetric === 'cm') {
    return _hgt >= 150 && _hgt <= 193
  }
  if (hgtMetric === 'in') {
    return _hgt >= 59 && _hgt <= 76
  }
  return false
}
const validateHCL = (hcl: string): boolean => /^#[0-9a-f]{6}$/.test(hcl)
const validatePID = (pid: string): boolean => /^[0-9]{9}$/.test(pid)
const validateECL = (ecl: string): boolean => !!~[ 'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth' ].indexOf(ecl)

const validatePassport1 = (obj: any): obj is Passport => {
  return (obj as Passport).byr !== undefined
      && (obj as Passport).iyr !== undefined
      && (obj as Passport).eyr !== undefined
      && (obj as Passport).hgt !== undefined
      && (obj as Passport).hcl !== undefined
      && (obj as Passport).ecl !== undefined
      && (obj as Passport).pid !== undefined
}
const validatePassport2 = (obj: any): obj is Passport => {
  const only1ECL: boolean = Object.keys(obj).filter(k => k === 'ecl').length < 2
  return (obj as Passport).byr !== undefined
      && (obj as Passport).iyr !== undefined
      && (obj as Passport).eyr !== undefined
      && (obj as Passport).hgt !== undefined
      && (obj as Passport).hcl !== undefined
      && (obj as Passport).ecl !== undefined
      && (obj as Passport).pid !== undefined
      && only1ECL
      && validateBYR(obj.byr)
      && validateIYR(obj.iyr)
      && validateEYR(obj.eyr)
      && validateHGT(obj.hgt)
      && validateHCL(obj.hcl)
      && validateECL(obj.ecl)
      && validatePID(obj.pid)
}

const run = async (validatePassport: Function): Promise<number> => {
  const reader = new FileReader(`${__dirname}/${FILENAME}`)

  let passport
  let valid: number = 0
  while ((passport = getNextPassport(reader)) !== null) {
    const isValid: boolean = validatePassport(passport)
    // if (isValid) console.debug(`PASSPORT:: Valid:${isValid}`, passport, '\n')
    valid += isValid ? 1 : 0
  }
  // console.debug(`Number of Passports: Valid: ${valid}`)
  return valid
}

const solution: Solution = {
  part1: () => run(validatePassport1).then((result: number) => {
    console.log(`Result: 1 = ${JSON.stringify(result)}`)
  }),
  part2: () => run(validatePassport2).then((result: number) => {
    console.log(`Result: 2 = ${JSON.stringify(result)}`)
  })
}

export default solution
