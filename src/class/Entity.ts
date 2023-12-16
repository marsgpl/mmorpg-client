import {
    InstantiatedEntries,
    Vector3,
    Mesh,
} from '@babylonjs/core'
import { Asset } from './Asset'

export interface EntityProps {
    name: string
    asset?: Asset
    scale?: number | Vector3
}

export abstract class Entity {
    protected name: string
    protected mesh: Mesh
    protected instance: InstantiatedEntries

    constructor({
        name,
        asset,
        scale,
    }: EntityProps) {
        if (!asset) {
            throw Error('no asset')
        }

        this.name = name
        this.instance = asset.getContainer().instantiateModelsToScene(n => name + ':' + n, false)
        this.mesh = this.instance.rootNodes[0] as Mesh
        this.mesh.name = name

        if (scale) {
            this.mesh.scaling = typeof scale === 'number'
                ? new Vector3(scale, scale, scale)
                : scale
        }
    }

    public getMesh() {
        return this.mesh
    }

    protected getAnimationGroup(index: number) {
        const ag = this.instance.animationGroups[index]

        if (!ag) {
            throw Error('no ag')
        }

        return ag
    }

    protected playAnimation(index: number, loop: boolean) {
        this.instance.animationGroups.forEach((g, i) => {
            if (i === index) {
                g.start(loop)
            } else {
                g.stop()
            }
        })
    }
}
