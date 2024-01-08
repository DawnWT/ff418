import { GAME_OBJECTS } from '../ressources/objects.js'
import { FFBE_REQUESTS } from '../ressources/requests.js'
import { VARIABLES } from '../ressources/variables.js'
import { type MstItem } from '../types/ffbe-api.js'
import { FFBECrypto } from './crypto.js'

export class FFBEMst {
  constructor(private crypto: FFBECrypto) {}

  #fetchMstUrl = `https://v880-lapis.gumi.sg/lapisProd/app/php/gme/actionSymbol/${FFBE_REQUESTS.Initialize.Url}.php`

  #createMstRequestPacket(): string {
    const now = new Date(Date.now())

    const sub = {
      [GAME_OBJECTS.UserInfo]: [
        {
          [VARIABLES.OperatingSystem]: '5_ios14.2',
          [VARIABLES.PurchaseSignature]: '1',
          [VARIABLES.BuildVersion]: 'ver.8400',
          [VARIABLES.Time]: `${now.getFullYear()}-${
            now.getMonth() < 9 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
          }-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()} ${
            now.getHours() < 9 ? `0${now.getHours() + 1}` : now.getHours() + 1
          }:${now.getMinutes() < 9 ? `0${now.getMinutes() + 1}` : now.getMinutes() + 1}:${
            now.getSeconds() < 9 ? `0${now.getSeconds() + 1}` : now.getSeconds() + 1
          }`,
          [VARIABLES.AppVersion]: '1152',
          [VARIABLES.CountryCode]: 'US',
          [VARIABLES.MacroToolRunningStatus]: '0',
          [VARIABLES.Ymd]: `${now.getFullYear()}${now.getMonth() < 9 ? '0' : ''}${now.getMonth() + 1}${
            now.getDate() < 10 ? '0' : ''
          }${now.getDate()}`,
        },
      ],
      [GAME_OBJECTS.SignalKey]: [{ [VARIABLES.Data]: null }],
      [GAME_OBJECTS.VersionInfo]: [
        { [VARIABLES.KeyName]: 'F_APP_Version_IOS', [VARIABLES.Value]: '1152' },
        { [VARIABLES.KeyName]: 'F_RSC_VERSION', [VARIABLES.Value]: '0' },
        { [VARIABLES.KeyName]: 'F_MST_VERSION', [VARIABLES.Value]: '4820' },
      ],
    }

    const subString = JSON.stringify(sub)
    const encryptedSubString = this.crypto.encrypt(subString, FFBE_REQUESTS.Initialize.EncodeKey)

    const packet = {
      [GAME_OBJECTS.Header]: {
        [VARIABLES.RequestID]: FFBE_REQUESTS.Initialize.RequestID,
        '9K0Pzcpd': '9999',
      },
      [VARIABLES.Encrypted]: {
        [VARIABLES.Data]: encryptedSubString,
      },
    }

    return JSON.stringify(packet)
  }

  async fetchMstFile(): Promise<{ inMaint: boolean; data: MstItem[] }> {
    const packet = this.#createMstRequestPacket()

    try {
      const response = await fetch(this.#fetchMstUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          'User-Agent': 'FF%20EXVIUS/8000 CFNetwork/1121.2.2 Darwin/19.3.0',
          'Accept-Language': 'en-us',
          'Accept-Encoding': 'gzip',
        },
        body: Buffer.from(packet, 'utf-8'),
      })

      const responseJson = (await response.json()) as {
        [VARIABLES.Encrypted]: {
          [VARIABLES.Data]: string
        }
      }

      const decryptedResponse = this.crypto.decrypt(
        responseJson[VARIABLES.Encrypted][VARIABLES.Data],
        FFBE_REQUESTS.Initialize.EncodeKey
      )

      const parsedResponse = JSON.parse(decryptedResponse) as {
        [k: string]: unknown
        [GAME_OBJECTS.VersionInfo]: MstItem[]
      }

      return {
        inMaint: false,
        data: parsedResponse[GAME_OBJECTS.VersionInfo],
      }
    } catch (_) {
      return {
        inMaint: true,
        data: [],
      }
    }
  }
}
