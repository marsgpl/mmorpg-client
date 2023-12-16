import { ContainerAssetTask } from '@babylonjs/core'

export class Asset {
    constructor(
        public name: string,
        public task: ContainerAssetTask
    ) {}

    public getContainer() {
        return this.task.loadedContainer
    }
}
