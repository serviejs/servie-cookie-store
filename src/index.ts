import { Request, Response } from 'servie'
import { parse, serialize, CookieSerializeOptions } from 'cookie'

/**
 * The `keys` interface is used for signing and verifying cookies.
 */
export interface Keys {
  sign (data: string): string
  verify (data: string, digest: string): boolean
}

/**
 * The cookie class reads and writes cookies.
 */
export class Cookie {

  cache: { [key: string]: string } | undefined

  constructor (public req: Request, public keys?: Keys) {}

  get (key: string) {
    if (!this.cache) {
      const cookie = this.req.headers.get('Cookie')

      this.cache = cookie ? parse(cookie) : {}
    }

    if (this.cache.hasOwnProperty(key)) {
      return this.decode(this.cache[key])
    }
  }

  decode (value: string) {
    if (!this.keys) return parseValue(value)

    const index = value.indexOf('.')

    if (index === -1) return

    const data = value.substr(0, index)
    const digest = value.substr(index + 1)

    if (this.keys.verify(data, digest)) return parseValue(data)

    return
  }

  encode (value: any) {
    const val = JSON.stringify(value)
    const data = new Buffer(val, 'utf8').toString('base64').replace(/=+$/, '')

    if (!this.keys) return data

    const digest = this.keys.sign(data)

    return `${data}.${digest}`
  }

  stringify (key: string, value: any, options?: CookieSerializeOptions) {
    return serialize(key, this.encode(value), options)
  }

  set (res: Response, key: string, value: any, options?: CookieSerializeOptions) {
    res.headers.append('Set-Cookie', this.stringify(key, value, options))
  }

}

/**
 * Attempt to parse the cookie data as base64 JSON.
 */
function parseValue (value: string): any | undefined {
  try {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf8'))
  } catch (e) { /* Ignore. */ }
}
