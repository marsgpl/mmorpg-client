import { AssetsManager, Mesh, Scene } from '@babylonjs/core'
import '@babylonjs/loaders/OBJ/objFileLoader'

const ASSET_ROOT = './assets/'

export function loadAssets(scene: Scene, assets: string[]): Promise<Record<string, Mesh>> {
    return new Promise((resolve, reject) => {
        const meshes: Record<string, Mesh> = {}

        const assetsManager = new AssetsManager(scene)

        for (const name of assets) {
            const task = assetsManager.addMeshTask(name, null, ASSET_ROOT, `${name}.obj`)

            task.onSuccess = task => {
                if (task.loadedMeshes.length) {
                    meshes[task.name] = Mesh.MergeMeshes(task.loadedMeshes as Mesh[])!
                } else {
                    reject(`Asset has no meshes: ${task.name}`)
                }
            }
        }

        assetsManager.onFinish = () => {
            resolve(meshes)
        }

        assetsManager.onTaskError = task => {
            reject(`Failed to load asset: ${task.name}`)
        }

        assetsManager.load()
    })
}
