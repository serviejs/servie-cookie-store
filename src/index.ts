import { Request, Response } from 'servie'
import { parse, serialize, CookieSerializeOptions } from 'cookie'

/**
 * The `keys` interface is used for signing and verifying cookies.
 */
export interface Keys {
  encode (data: Buffer): Buffer
  decode (data: Buffer): Buffer | undefined
}

/**
 * Cookie serialization subtract expiration parameters.
 */
export type DeleteCookieOptions = Pick<CookieSerializeOptions, Exclude<keyof CookieSerializeOptions, 'maxAge' | 'expires'>>

/**
 * The cookie class reads and writes cookies.
 */
export class Cookie {

  cache: { [key: string]: string } | undefined

  constructor (public req: Request, public keys?: Keys) {}

  get (key: string) {
    const cache = this.cache || getCookies(this.req)

    if (cache[key]) return this.decode(cache[key])
  }

  set (res: Response, key: string, value: any, options?: CookieSerializeOptions) {
    res.headers.append('Set-Cookie', this.stringify(key, value, options))
  }

  delete (res: Response, key: string, options?: DeleteCookieOptions) {
    const deleteOptions = Object.assign({}, options, { maxAge: -1, expires: undefined })
    res.headers.append('Set-Cookie', serialize(key, '', deleteOptions))
  }

  stringify (key: string, value: any, options?: CookieSerializeOptions) {
    return serialize(key, this.encode(value), options)
  }

  encode (value: any) {
    if (value === undefined) return ''
    if (!this.keys) return encode(stringifyData(value))

    return encode(this.keys.encode(stringifyData(value)))
  }

  decode (value: string) {
    if (value === '') return undefined
    if (!this.keys) return parseData(decode(value))

    const data = this.keys.decode(decode(value))
    return data ? parseData(data) : undefined
  }

}

/**
 * Safe URL base64 encoding.
 */
const MAP_URL_BASE64 = new Map([
  ['/', '_'],
  ['+', '-'],
  ['=', '']
])

/**
 * Encode buffer to string for cookie serialization.
 */
function encode (b: Buffer) {
  return b.toString('base64').replace(/[/+=]/g, x => MAP_URL_BASE64.get(x)!)
}

/**
 * Decode cookie string to buffer.
 */
function decode (s: string) {
  return Buffer.from(s, 'base64')
}

/**
 * Parse data from cookie.
 */
function parseData (b: Buffer) {
  if (!b.length) return

  try { return JSON.parse(b.toString('utf8')) } catch (e) { /* Ignore. */ }
}

/**
 * Stringify data for cookie.
 */
function stringifyData (d: any) {
  return Buffer.from(JSON.stringify(d), 'utf8')
}

/**
 * Transform request into cookies.
 */
function getCookies (req: Request) {
  const cookies: { [key: string]: string } = Object.create(null)
  for (const c of req.headers.getAll('cookie')) Object.assign(cookies, parse(c))
  return cookies
}
