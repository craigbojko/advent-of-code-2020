import type { Solution } from '../index'
import fs from 'fs'

const FILENAME = 'data.txt'

const readFile = (filename: string): string[] => {
  try {
    const fh: Buffer = fs.readFileSync(`${__dirname}/${filename}`)
    const items: string[] = fh.toString().split('\n')
    return items
  } catch (e) {
    console.error(`Error opening datafile: ${e.msg}`)
    throw new Error(e.msg)
  }
}

const decode = (seatStr: string, offsetStart: number = 0, offsetEnd: number = seatStr.length): number => 
  parseInt(
    seatStr
      .substring(offsetStart, offsetEnd)
      .split('')
      .map(i => !!~['F', 'L'].indexOf(i) ? 0 : 1)
      .join(''),
    2
  )

const seatId = (row: number, col: number): number => (row * 8) + col

const part1 = async (): Promise<number> => {
  const seats: string[] = readFile(FILENAME)
  const seatIds: number[] = seats.map(seat => {
    const row: number = decode(seat, 0, 7)
    const col: number = decode(seat, 7)
    return seatId(row, col)
  })
  return Math.max(...seatIds)
}

const solution: Solution = {
  part1: () => part1().then((result: number) => {
    console.log(`Result: 1 = ${JSON.stringify(result)}`)
  })
}

export default solution

