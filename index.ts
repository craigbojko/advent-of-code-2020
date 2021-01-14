import { default as problem1 } from './1'
import { default as problem2 } from './2'
import { default as problem3 } from './3'
import { default as problem4 } from './4'
import { default as problem5 } from './5'
import { default as problem6 } from './6'

export interface Solution {
  part1(): any;
  part2?(): any;
}

export const problems = [
  problem1,
  problem2,
  problem3,
  problem4,
  problem5,
  problem6,
]

;(function main () {
  const args: string[] = process.argv
  const argc: string = args[2]
  if (argc) {
    const i: number = parseInt(argc)
    if (problems[i - 1]) {
      const solution: Solution = problems[i - 1]
      solution.part1()
      solution.part2 && solution.part2()
    } else {
      console.warn(`Unable to obtain solution: arg ${argc}`)
      process.exit(1)
    }
  } else {
    console.warn(`You should provide the problem as an integer value: e.g. "yarn start 1"`)
    process.exit(1)
  }
}())
