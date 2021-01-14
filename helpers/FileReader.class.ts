import fs from 'fs'

export default class FileReader {
  filename: string
  fd: number
  
  buffer: Buffer
  bufferSize: number = 10
  
  filePos: number = 0
  bufferPos: number = 0
  bytesInBuffer: number = 0

  constructor (filename: string) {
    this.filename = filename
    this.fd = fs.openSync(this.filename, 'r')
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
