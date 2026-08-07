interface IRgbColor {
  readonly red: number
  readonly green: number
  readonly blue: number
}

export function getSystemAccentColor(value: string | null): string | null {
  if (!value) {
    return null
  }

  const match = /^#([\da-f]{6})(?:[\da-f]{2})?$/i.exec(value)
  if (!match) {
    return null
  }

  const hex = match[1]
  return `#${hex.toLowerCase()}`
}

function getRgbColor(value: string): IRgbColor {
  return {
    red: parseInt(value.slice(1, 3), 16),
    green: parseInt(value.slice(3, 5), 16),
    blue: parseInt(value.slice(5, 7), 16),
  }
}

function getLuminanceChannel(value: number): number {
  const channel = value / 255
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4)
}

export function getAccentForeground(value: string): '#000000' | '#ffffff' {
  const { red, green, blue } = getRgbColor(value)
  const luminance =
    0.2126 * getLuminanceChannel(red) +
    0.7152 * getLuminanceChannel(green) +
    0.0722 * getLuminanceChannel(blue)
  return luminance > 0.179 ? '#000000' : '#ffffff'
}

export function applySystemAccentColor(value: string | null) {
  const accentColor = getSystemAccentColor(value)
  const rootStyle = document.documentElement.style

  if (!accentColor) {
    rootStyle.removeProperty('--system-accent-color')
    rootStyle.removeProperty('--system-accent-foreground-color')
    rootStyle.removeProperty('--system-accent-source')
    return
  }

  rootStyle.setProperty('--system-accent-color', accentColor)
  rootStyle.setProperty(
    '--system-accent-foreground-color',
    getAccentForeground(accentColor)
  )
  rootStyle.setProperty('--system-accent-source', 'os')
}
