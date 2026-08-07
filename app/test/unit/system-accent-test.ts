import assert from 'node:assert'
import { afterEach, describe, it } from 'node:test'
import {
  applySystemAccentColor,
  getAccentForeground,
  getSystemAccentColor,
} from '../../src/ui/lib/system-accent'

afterEach(() => {
  document.documentElement.style.removeProperty('--system-accent-color')
  document.documentElement.style.removeProperty(
    '--system-accent-foreground-color'
  )
  document.documentElement.style.removeProperty('--system-accent-source')
})

describe('system accent', () => {
  it('normalizes Electron accent colors and discards their alpha channel', () => {
    assert.equal(getSystemAccentColor('#005FB8FF'), '#005fb8')
    assert.equal(getSystemAccentColor('#005FB800'), '#005fb8')
    assert.equal(getSystemAccentColor('#005fb8'), '#005fb8')
    assert.equal(getSystemAccentColor('#invalid'), null)
  })

  it('uses a readable foreground for accent surfaces', () => {
    assert.equal(getAccentForeground('#005fb8'), '#ffffff')
    assert.equal(getAccentForeground('#fce100'), '#000000')
  })

  it('applies and clears system accent properties', () => {
    applySystemAccentColor('#005FB8FF')
    assert.equal(
      document.documentElement.style.getPropertyValue('--system-accent-color'),
      '#005fb8'
    )
    assert.equal(
      document.documentElement.style.getPropertyValue(
        '--system-accent-foreground-color'
      ),
      '#ffffff'
    )
    assert.equal(
      document.documentElement.style.getPropertyValue('--system-accent-source'),
      'os'
    )

    applySystemAccentColor(null)
    assert.equal(
      document.documentElement.style.getPropertyValue('--system-accent-color'),
      ''
    )
  })
})
