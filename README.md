# Servie Cookie Store

[![NPM version](https://img.shields.io/npm/v/servie-cookie-store.svg?style=flat)](https://npmjs.org/package/servie-cookie-store)
[![NPM downloads](https://img.shields.io/npm/dm/servie-cookie-store.svg?style=flat)](https://npmjs.org/package/servie-cookie-store)
[![Build status](https://img.shields.io/travis/serviejs/servie-cookie-store.svg?style=flat)](https://travis-ci.org/serviejs/servie-cookie-store)
[![Test coverage](https://img.shields.io/coveralls/serviejs/servie-cookie-store.svg?style=flat)](https://coveralls.io/r/serviejs/servie-cookie-store?branch=master)

> Cookie storage and manipulation for Servie.

## Installation

```
npm install servie-cookie-store --save
```

## Usage

```ts
import { Cookie } from 'servie-cookie-store'
```

### Constructor

The `Cookie` constructor accepts the Servie `Request` and `Response` objects. It also optionally accepts a keys object for signing the cookie payloads. This object MUST have `sign(data)` and `verify(data, digest)` methods (compatible with [Keygrip](https://github.com/crypto-utils/keygrip)).

```ts
const keys = new Keygrip(['SEKRIT2', 'SEKRIT1'])

function handler (req) {
  const cookie = new Cookie(req, keys)
  const session = cookie.get('session') || {}
  const res = new Response()

  cookie.set(res, 'session', Object.assign(session, { demo: true }))
}
```

### Methods

* `get(key)` retrieves the cookie by `key` name, returning `undefined` when not found or invalid
* `stringify(key, data, options?)` creates a `Set-Cookie` header with optional [cookie options](https://github.com/jshttp/cookie#options-1)
* `set(res, key, data, options?)` sets the cookie with optional [cookie options](https://github.com/jshttp/cookie#options-1)
* `encode(value)` stringifies a JavaScript value
* `decode(value)` parses the cookie value into JavaScript

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
