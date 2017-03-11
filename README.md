# Servie Cookie Store

[![Greenkeeper badge](https://badges.greenkeeper.io/blakeembrey/node-servie-cookie-store.svg)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

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

function handler (req, res) {
  const cookie = new Cookie(req, res, keys)
  const session = cookie.get('session') || {}

  cookie.set('session', Object.assign(session, { demo: true }))
}
```

### Methods

* `get(key)` retrieves the cookie by `key` name, returning `undefined` when not found or invalid
* `set(key, data, options)` sets the cookie with [cookie options](https://github.com/jshttp/cookie#options-1)
* `encode(value)` stringifies a JavaScript value
* `decode(value)` parses the cookie value into JavaScript

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/servie-cookie-store.svg?style=flat
[npm-url]: https://npmjs.org/package/servie-cookie-store
[downloads-image]: https://img.shields.io/npm/dm/servie-cookie-store.svg?style=flat
[downloads-url]: https://npmjs.org/package/servie-cookie-store
[travis-image]: https://img.shields.io/travis/blakeembrey/node-servie-cookie-store.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/node-servie-cookie-store
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/node-servie-cookie-store.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/node-servie-cookie-store?branch=master
