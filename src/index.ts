import { CommonRequest, CommonResponse } from "servie/dist/common";
import { parse, serialize, CookieSerializeOptions } from "cookie";
import { encode, decode } from "universal-base64url";
import { URLSearchParams } from "url";

/**
 * Cache private key.
 */
export const kCache = Symbol("cache");

/**
 * The `keys` interface is used for signing and verifying cookies.
 */
export interface Keys {
  encode(data: Buffer): Buffer;
  decode(data: Buffer): Buffer | undefined;
}

/**
 * Cookie serialization subtract expiration parameters.
 */
export type DeleteCookieOptions = Pick<
  CookieSerializeOptions,
  Exclude<keyof CookieSerializeOptions, "maxAge" | "expires">
>;

/**
 * The cookie class reads and writes cookies.
 */
export class Cookie {
  [kCache]: URLSearchParams | undefined;

  constructor(public req: CommonRequest, public keys?: Keys) {}

  get cookies() {
    return this[kCache] || (this[kCache] = getCookies(this.req));
  }

  get(name: string) {
    const value = this.cookies.get(name);
    if (value) return this.decode(value);
  }

  getAll(name: string) {
    return this.cookies.getAll(name).map(x => this.decode(x));
  }

  set(
    res: CommonResponse,
    key: string,
    value: any,
    options?: CookieSerializeOptions
  ) {
    res.headers.append("Set-Cookie", this.stringify(key, value, options));
  }

  delete(res: CommonResponse, key: string, options?: DeleteCookieOptions) {
    const deleteOptions = Object.assign({}, options, {
      maxAge: -1,
      expires: undefined
    });
    res.headers.append("Set-Cookie", serialize(key, "", deleteOptions));
  }

  stringify(key: string, value: any, options?: CookieSerializeOptions) {
    return serialize(key, this.encode(value), options);
  }

  encode(value: any) {
    if (value === undefined) return "";
    if (!this.keys) return encode(JSON.stringify(value));

    return encode(
      this.keys.encode(Buffer.from(JSON.stringify(value))).toString("binary")
    );
  }

  decode(value: string) {
    if (value === "") return undefined;
    if (!this.keys) return parseData(decode(value));

    const data = this.keys.decode(Buffer.from(decode(value), "binary"));
    return data ? parseData(data.toString("binary")) : undefined;
  }
}

/**
 * Parse data from cookie.
 */
function parseData(value: string) {
  if (!value.length) return;

  try {
    return JSON.parse(value);
  } catch (e) {
    /* Ignore. */
  }
}

/**
 * Transform request into cookies.
 */
function getCookies(req: CommonRequest) {
  const cookies = new URLSearchParams();
  for (const c of req.headers.getAll("cookie")) {
    for (const [key, value] of Object.entries(parse(c))) {
      cookies.append(key, value);
    }
  }
  return cookies;
}
