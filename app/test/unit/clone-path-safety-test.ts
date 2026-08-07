import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as Path from 'path'
import {
  parseRepositoryIdentifier,
  sanitizeCloneName,
} from '../../src/lib/remote-parsing'

describe('sanitizeCloneName', () => {
  it('returns a simple name unchanged', () => {
    assert.equal(sanitizeCloneName('Hello-World'), 'Hello-World')
  })

  it('extracts a single component from traversal input', () => {
    assert.equal(sanitizeCloneName('x..\\..\\..\\..\\foo'), 'foo')
  })

  it('rejects empty and traversal-only names', () => {
    assert.equal(sanitizeCloneName('..'), null)
    assert.equal(sanitizeCloneName(''), null)
    assert.equal(sanitizeCloneName('.git'), null)
  })

  it('keeps derived clone paths contained', () => {
    const result = parseRepositoryIdentifier(
      'https://evil.com/owner/x..\\..\\..\\.\\.ssh.git'
    )
    assert(result !== null)
    const safeName = sanitizeCloneName(result.name)
    assert(safeName !== null)

    const baseDir = 'C:\\Users\\victim\\Documents\\GitHub'
    const resolved = Path.win32.resolve(Path.win32.join(baseDir, safeName))
    assert(resolved.startsWith(Path.win32.resolve(baseDir)))
  })
})
