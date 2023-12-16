import { Entity } from './Entity'

export class CharacterEntity extends Entity {
    protected deadIdx = 0
    protected hitIdx = 1
    protected idleIdx = 2
    protected walkIdx = 3

    protected walkId = 0

    public getCurrentWalkId() {
        return this.walkId
    }

    public idle() {
        this.playAnimation(this.idleIdx, true)
    }

    public walk() {
        this.playAnimation(this.walkIdx, true)
        return ++this.walkId
    }

    public die() {
        this.playAnimation(this.deadIdx, false)
    }

    public hit() {
        this.playAnimation(this.hitIdx, false)
    }
}
