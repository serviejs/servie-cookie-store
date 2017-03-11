import Keygrip = require('keygrip')
import { Request, Response } from 'servie'
import { Cookie } from './index'

describe('servie cookie store', () => {
  it('should work with regular cookies', () => {
    const req = new Request({ url: '/' })
    const res = new Response()
    const cookie = new Cookie(req, res)

    req.headers.set('Cookie', `a=${cookie.encode(1)}; b=${cookie.encode(2)}`)

    expect(cookie.get('a')).toEqual(1)
    expect(cookie.get('b')).toEqual(2)

    cookie.set('a', { test: true })
    cookie.set('b', 'abc')

    expect(res.headers.object()).toMatchSnapshot()
  })

  it('should sign cookies', () => {
    const req = new Request({ url: '/' })
    const res = new Response()
    const cookie = new Cookie(req, res, new Keygrip(['secret']))

    req.headers.set('Cookie', `a=${cookie.encode(1)}; b=${cookie.encode(2)}`)

    expect(cookie.get('a')).toEqual(1)
    expect(cookie.get('b')).toEqual(2)

    cookie.set('a', { test: true })
    cookie.set('b', 'abc')

    expect(res.headers.object()).toMatchSnapshot()
  })

  it('should ignore bad decodes', () => {
    const req = new Request({ url: '/' })
    const res = new Response()
    const cookie = new Cookie(req, res, new Keygrip(['secret']))

    req.headers.set('Cookie', `a=1; b=${cookie.encode(2).split('.')[0]}.fakedigest`)

    expect(cookie.get('a')).toBe(undefined)
    expect(cookie.get('b')).toBe(undefined)
  })
})
