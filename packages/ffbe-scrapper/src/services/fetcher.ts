// import { TextDecoderStream } from 'node:stream/web'

import { FILES } from '../ressources/files.js'
import { VARIABLES } from '../ressources/variables.js'
import type { MstItem, ServerVersion } from '../types/ffbe-api.js'
import type { FFBECrypto } from './crypto.js'

export abstract class FFBEFetcher {
  abstract serverVersion: ServerVersion
  abstract inMaint: boolean

  abstract iterateDatItems(mstItem: MstItem): AsyncGenerator<string, void>
  abstract getDatItems(mstItem: MstItem): Promise<string[]>
}

export const FFBEFetcherFactory = function (
  serverVersion: ServerVersion,
  inMaint: boolean,
  crypto: FFBECrypto
): FFBEFetcher {
  if (serverVersion === 'GL') {
    return new FFBEFetcherGL(crypto, inMaint)
  }

  return new FFBEFetcherJP(crypto, inMaint)
}

export class FFBEFetcherGL implements FFBEFetcher {
  constructor(
    private crypto: FFBECrypto,
    public inMaint: boolean
  ) {}

  serverVersion = 'GL' as const

  #datFileUrl(loc: 'localized_texts/en' | 'mst', fileVersion: number, fileName: string) {
    return `https://lapis-prod-dlc-gumi-sg.akamaized.net/dlc_assets_prod/${loc}/Ver${fileVersion}_${fileName}.dat?v=0`
  }

  async #fetchDatFile(mstItem: MstItem) {
    const fileName = mstItem[VARIABLES.KeyName]
    const loc = fileName.includes('F_TEXT') ? 'localized_texts/en' : 'mst'

    const nameKey = FILES[fileName]

    const fileVersion = Number(mstItem[VARIABLES.Value])

    return fetch(this.#datFileUrl(loc, fileVersion, nameKey.Name))
  }

  async *iterateDatItems(mstItem: MstItem) {
    const response = await this.#fetchDatFile(mstItem)

    const nameKey = FILES[mstItem[VARIABLES.KeyName]]

    if (!response.body) {
      throw new Error('No body in response')
    }

    const textStream = response.body.pipeThrough(new TextDecoderStream())

    let stockChunk = ''

    // @ts-expect-error ttt
    for await (const chunk of textStream) {
      const filledChunk = stockChunk + chunk
      const splitedChunk = filledChunk.split(/\r\n|\r|\n/).filter((w) => w)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (chunk.endsWith('\n') || chunk.endsWith('\r') || chunk.endsWith('\r\n')) {
        stockChunk = ''
      } else {
        stockChunk = splitedChunk.pop() ?? ''
      }

      for (const line of splitedChunk) {
        yield this.crypto.decrypt(line, nameKey.Key, nameKey.oldEncrypt)
      }
    }

    if (stockChunk.length > 0) {
      yield this.crypto.decrypt(stockChunk, nameKey.Key, nameKey.oldEncrypt)
    }
  }

  async getDatItems(mstItem: MstItem) {
    const response = await this.#fetchDatFile(mstItem)

    const nameKey = FILES[mstItem[VARIABLES.KeyName]]

    const datContent = await response.text()

    const datLines = datContent.split(/\r\n|\r|\n/).filter((w) => w)

    const datas = datLines.flatMap((line) => {
      const decryptedMst = this.crypto.decrypt(line, nameKey.Key, nameKey.oldEncrypt)

      const splited = decryptedMst.split(/\r\n|\r|\n/).filter((m) => m)

      return splited
    })

    return datas
  }
}

export class FFBEFetcherJP implements FFBEFetcher {
  constructor(
    private crypto: FFBECrypto,
    public inMaint: boolean
  ) {}

  serverVersion = 'JP' as const

  async #fetchDatFile(mstItem: MstItem) {
    const fileName = mstItem[VARIABLES.KeyName]
    const loc = fileName.includes('F_TEXT') ? 'localized_texts/fr' : 'mst'

    const nameKey = FILES[fileName]

    const fileVersion = Number(mstItem[VARIABLES.Value])

    return fetch(
      `https://lapis-prod-dlc-gumi-sg.akamaized.net/dlc_assets_prod/${loc}/Ver${fileVersion}_${nameKey.Name}.dat?v=0`
    )
  }

  async *iterateDatItems(mstItem: MstItem) {
    const response = await this.#fetchDatFile(mstItem)

    const nameKey = FILES[mstItem[VARIABLES.KeyName]]
    // const crypto = this.crypto.create(nameKey.Key, nameKey.oldEncrypt)

    if (!response.body) {
      throw new Error('No body in response')
    }

    const textStream = response.body.pipeThrough(new TextDecoderStream())

    let stock = ''

    // @ts-expect-error ttt
    for await (const chunk of textStream) {
      const filledChunk = stock + chunk
      const splitedChunk = filledChunk.split(/\r\n|\r|\n/).filter((w) => w)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (chunk.endsWith('\n') || chunk.endsWith('\r') || chunk.endsWith('\r\n')) {
        stock = ''
      } else {
        stock = splitedChunk.pop() ?? ''
      }

      for (const line of splitedChunk) {
        yield this.crypto.decrypt(line, nameKey.Key, nameKey.oldEncrypt)
      }
    }
  }

  async getDatItems(mstItem: MstItem) {
    const response = await this.#fetchDatFile(mstItem)

    const nameKey = FILES[mstItem[VARIABLES.KeyName]]

    const datContent = await response.text()

    const datLines = datContent.split(/\r\n|\r|\n/).filter((w) => w)

    const datas = datLines.flatMap((line) => {
      // const tempKey =
      //   nameKey.Key.length % 16 === 0
      //     ? nameKey.Key
      //     : nameKey.Key.padEnd(nameKey.Key.length + (16 - (nameKey.Key.length % 16)), '\0')

      const decryptedMst = this.crypto.decrypt(line, nameKey.Key, nameKey.oldEncrypt)

      // if (old) {
      //   decryptedMst = Crypto.OldDecrypt(base64, tempKey)
      // } else {
      //   decryptedMst = Crypto.Decrypt(base64, tempKey)
      // }

      const splited = decryptedMst.split(/\r\n|\r|\n/).filter((m) => m)

      return splited
    })

    return datas
  }
}
