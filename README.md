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

The `Cookie` constructor accepts the Servie `Request` and `Response` objects. It optionally accepts a keys object for signing the cookie payloads. This object _MUST_ have `encode(data)` and `decode(data)` methods, compatible with [keysign](https://github.com/serviejs/keysign) and [keygrip](https://github.com/serviejs/keycrypt). You _SHOULD_ always sign cookies to avoid client-side tampering with requests.

```ts
const keys = new Keysign(['SEKRIT2', 'SEKRIT1'])

function handler (req) {
  const cookie = new Cookie(req, keys)
  const session = cookie.get('session')
  const res = new Response()

  cookie.set(res, 'session', Object.assign({}, session, { demo: true }))
}
```

### Methods

* `get(key)` retrieves the cookie by `key` name, returning `undefined` when not found or invalid
* `set(res, key, data, options?)` sets the cookie with optional [cookie options](https://github.com/jshttp/cookie#options-1)
* `delete(res, key, options?)` deletes the cookie by setting `maxAge` into past with optional [cookie options](https://github.com/jshttp/cookie#options-1)
* `stringify(key, data, options?)` creates a `Set-Cookie` header with optional [cookie options](https://github.com/jshttp/cookie#options-1)
* `encode(value)` stringifies a JavaScript value
* `decode(value)` parses the cookie string into JavaScript

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
