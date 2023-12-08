import { Color3, Color4 } from '@babylonjs/core'

export function hex3(hex: string): Color3 {
    const r = parseInt(hex.substring(1, 3), 16) / 255
    const g = parseInt(hex.substring(3, 5), 16) / 255
    const b = parseInt(hex.substring(5, 7), 16) / 255

    return new Color3(r, g, b)
}

export function hex4(hex: string): Color4 {
    const r = parseInt(hex.substring(1, 3), 16) / 255
    const g = parseInt(hex.substring(3, 5), 16) / 255
    const b = parseInt(hex.substring(5, 7), 16) / 255
    const a = parseInt(hex.substring(7), 16) / 255

    return new Color4(r, g, b, a)
}
