import {
    Engine,
    Scene,
} from '@babylonjs/core'
import { city } from '../scene/city'

export class Game {
    public engine: Engine
    protected scene?: Scene

    constructor(protected canvas: HTMLCanvasElement) {
        this.engine = this.initEngine()
        this.switchScene(city(this))
    }

    protected initEngine() {
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

    protected async switchScene(scenePromise: Promise<Scene>) {
        this.engine.displayLoadingUI()

        this.unloadScene()

        this.scene = await scenePromise

        this.engine.hideLoadingUI()
    }

    protected unloadScene() {
        const { scene } = this

        if (!scene) {
            return
        }

        scene.detachControl()
        scene.dispose()
    }
}
