import fs from 'fs'

type Track = string
type Coordinate = {
  x: number;
  y: number;
}

const DEBUG: boolean = false
const DEBUG_DATA: string[] = [
  '..##.......',
  '#...#...#..',
  '.#....#..#.',
  '..#.#...#.#',
  '.#...##..#.',
  '..#.##.....',
  '.#.#.#....#',
  '.#........#',
  '#.##...#...',
  '#...##....#',
  '.#..#...#.#',
]

const FILENAME = 'data.txt'
const readFile = (): Track[] => {
  try {
    const fh: Buffer = fs.readFileSync(`${__dirname}/${FILENAME}`)
    const map: Track[] = fh.toString().split('\n')
    return map
  } catch (e) {
    console.error(e.message)
    throw e
  }
}

const getNewPosition = (tracks: Track[], startPos: Coordinate, x: number, y: number): [Coordinate, string] => {
  const yy: number = startPos.y + y
  const xx: number = (startPos.x + x) % (tracks[yy] && tracks[yy].length || 31)
  const newCoords: Coordinate = { x: xx, y: yy }
  const track: Track = tracks[newCoords.y]
  const char: string = track?.[newCoords.x] ?? ''
  return [newCoords, char]
}

const load = async (): Promise<Track[]> => {
  const map = DEBUG ? [...DEBUG_DATA] : readFile()
  return map
}

const traverse = (tracks: Track[], across: number = 3, down: number = 1): number => {
  let trees: number = 0
  let pos: Coordinate = { x: 0, y: 0 }

  DEBUG && console.log('\n')
  while(pos.y < tracks.length) {
    let char: string
    [pos, char] = getNewPosition(tracks, pos, across, down)
    if (char === '#') {
      trees += 1
    }

    if (DEBUG) {
      let outTrack: string[] = tracks[pos.y]?.split('') ?? []
      outTrack[pos.x] = '^'
      console.log(`${outTrack.join('')} -- ${char}`)
    }
  }
  return trees
}

const run = async (across?: number, down?: number): Promise<number> => {
  const tracks: Track[] = await load()
  const trees: number = traverse(tracks, across, down)
  return trees
}

export default {
  run
}

// Part 1
run().then((result: number) => {
  console.log(`Result: 1 = ${JSON.stringify(result)}`)
})

// Part 2
Promise
  .all([
    [1,1],
    [3,1],
    [5,1],
    [7,1],
    [1,2],
  ].map(([across, down]: number[]) => run(across, down)))
  .then((results: number[]) => {
    console.log(`Result: 2 ${JSON.stringify(results)} = ${results.reduce((a, b) => a * b, 1)}`)
  })
