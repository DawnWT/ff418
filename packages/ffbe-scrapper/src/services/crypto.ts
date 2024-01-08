import crypto from 'crypto'

export class FFBECrypto {
  constructor(private iv: string) {}

  #trimPadding(str: string, paddingChar: string) {
    let trimmed = str

    while (trimmed.endsWith(paddingChar)) {
      trimmed = trimmed.slice(0, -1)
    }

    return trimmed
  }

  #padding(str: string, encrypt: boolean): string {
    if (encrypt) {
      return str.padEnd(str.length + (16 - (str.length % 16)), String.fromCharCode(16 - (str.length % 16)))
    }

    return this.#trimPadding(str, str.charAt(str.length - 1))
  }

  encrypt(data: string, key: string): string {
    const buffIv = Buffer.from(this.iv, 'utf8')
    const buffKey = Buffer.alloc(16)
    Buffer.from(key, 'utf8').copy(buffKey)

    const paddedData = this.#padding(data, true)
    const buffData = Buffer.from(paddedData, 'utf8')

    const cipher = crypto.createCipheriv('aes-128-cbc', buffKey, buffIv)

    return Buffer.concat([cipher.update(buffData), cipher.final()]).toString('base64')
  }

  decrypt(data: string, key: string, old = false): string {
    const buffIv = Buffer.from(this.iv, 'utf8')
    const buffKey = Buffer.alloc(16)
    Buffer.from(key, 'utf8').copy(buffKey)

    const buffData = Buffer.from(data, 'base64')

    const decipher = old
      ? crypto.createDecipheriv('aes-128-ecb', buffKey, buffIv)
      : crypto.createDecipheriv('aes-128-cbc', buffKey, buffIv)

    const decrypted = Buffer.concat([decipher.update(buffData), decipher.final()]).toString('utf8')

    return this.#padding(decrypted, false)
  }
}
