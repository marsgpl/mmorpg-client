import { Game } from './class/Game'

import './index.module.css'

const onReady = () => {
    const canvas = document.createElement('canvas')

    document.body.appendChild(canvas)

    new Game(canvas)
}

document.addEventListener('DOMContentLoaded', onReady, { once: true })
