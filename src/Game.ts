import {
    Engine,
    Scene,
} from '@babylonjs/core'
import { city } from './scenes/city'

export class Game {
    private canvas: HTMLCanvasElement
    public engine: Engine
    private scene?: Scene

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.engine = this.initEngine()
        this.switchScene(city(this))
    }

    private initEngine() {
        const antialias = true

        const engine = new Engine(this.canvas, antialias, {
            loseContextOnDispose: true,
            powerPreference: 'high-performance',
        })

        engine.runRenderLoop(() => {
            this.scene?.render()
        })

        return engine
    }

    private async switchScene(scenePromise: Promise<Scene>) {
        this.engine.displayLoadingUI()

        this.unloadScene()

        this.scene = await scenePromise

        this.engine.hideLoadingUI()
    }

    private unloadScene() {
        const { scene } = this

        if (!scene) {
            return
        }

        scene.detachControl()
        scene.dispose()
    }
}
