import { AssetsManager, Scene } from '@babylonjs/core'
import '@babylonjs/loaders/OBJ'
import '@babylonjs/loaders/glTF'
import { Asset } from '../class/Asset'
import { ASSETS_ROOT } from '../config'

export function loadAssets(
    scene: Scene,
    config: Record<string, string>, // name: path
): Promise<Map<string, Asset>> {
    return new Promise((resolve, reject) => {
        const assets = new Map<string, Asset>() // name: Asset
        const assetsManager = new AssetsManager(scene)

        for (const [name, path] of Object.entries(config)) {
            const task = assetsManager.addContainerTask(name, null, ASSETS_ROOT, path)

            task.onSuccess = task => {
                assets.set(name, new Asset(name, task))
            }

            task.onError = (task, msg) => {
                reject(`Failed to load asset: ${msg}; task: ${task.name}`)
            }
        }

        assetsManager.onFinish = () => resolve(assets)
        assetsManager.load()
    })
}
