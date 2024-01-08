import { FILES_NAME } from './ressources/files.js'
import { VARIABLES } from './ressources/variables.js'
import { rawSkillOfUnitSchema } from './schemas/skillOfUnit.js'
import { rawUnitSchema } from './schemas/unit.js'
import { FFBECrypto } from './services/crypto.js'
import { FFBEFetcher, FFBEFetcherFactory } from './services/fetcher.js'
import { FFBEMst } from './services/mst.js'
import { MstItem } from './types/ffbe-api.js'

class FFBEScrapper {
  constructor(version: 'GL' | 'JP', iv: string, mst?: string) {
    this.#crypto = new FFBECrypto(iv)
    this.#fetcher = FFBEFetcherFactory(version, false, this.#crypto)
    this.#mst = new FFBEMst(this.#crypto)

    if (mst) {
      this.#mstSave = JSON.parse(mst) as MstItem[]
    }
  }

  #crypto: FFBECrypto
  #fetcher: FFBEFetcher
  #mst: FFBEMst
  #mstSave: MstItem[] = []

  async #getMstFile(): Promise<MstItem[]> {
    const mstList = await this.#mst.fetchMstFile()

    if (mstList.inMaint) {
      if (this.#mstSave.length === 0) {
        throw new Error('No Mst List available')
      }

      mstList.data = this.#mstSave
    } else {
      this.#mstSave = mstList.data
    }

    return mstList.data
  }

  async *#iterateItems(mstName: FILES_NAME) {
    const mstList = await this.#getMstFile()

    const mstItem = mstList.find((mst) => mst[VARIABLES.KeyName] === mstName)

    if (!mstItem) {
      throw new Error(`${mstName} not found`)
    }

    for await (const item of this.#fetcher.iterateDatItems(mstItem)) {
      const parsedItem = JSON.parse(item) as unknown

      yield [parsedItem, item]
    }
  }

  async #getItems(mstName: FILES_NAME) {
    const mstList = await this.#getMstFile()

    const mstItem = mstList.find((mst) => mst[VARIABLES.KeyName] === mstName)

    if (!mstItem) {
      throw new Error(`${mstName} not found`)
    }

    const items = await this.#fetcher.getDatItems(mstItem)

    const parsedItems = items.map((item) => JSON.parse(item) as unknown)

    return parsedItems
  }

  async getUnits() {
    const rawUnits = await this.#getItems('F_UNIT_MST')

    const validate = rawUnitSchema.array().parse(rawUnits)

    return validate
  }

  async *iterateUnits() {
    for await (const [Unit, raw] of this.#iterateItems('F_UNIT_MST')) {
      const validate = rawUnitSchema.safeParse(Unit)

      if (validate.success) {
        yield { ...validate.data, raw }
      }
    }
  }

  async getSkillsOfUnits() {
    const rawSkillsOfUnits = await this.#getItems('F_UNIT_SERIES_LV_ACQUIRE_MST')

    const validate = rawSkillOfUnitSchema.array().parse(rawSkillsOfUnits)

    return validate
  }

  async *iterateSkillsOfUnits() {
    for await (const [SkillOfUnit, raw] of this.#iterateItems('F_UNIT_SERIES_LV_ACQUIRE_MST')) {
      const validate = rawSkillOfUnitSchema.safeParse(SkillOfUnit)

      if (validate.success) {
        yield { ...validate.data, raw }
      }
    }
  }
export { FFBEScrapper }
