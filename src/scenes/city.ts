import {
    ArcFollowCamera,
    GroundMesh,
    HemisphericLight,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3,
    Animation,
} from '@babylonjs/core'
import { Game } from '../Game'
import { hex3, hex4 } from '../helpers/color'
import { loadAssets } from '../helpers/loadAssets'
import { ERROR_NO_MESH } from '../errors'

const assets = [
    'wizard',
    'werewolf',
]

export async function city(game: Game) {
    const scene = new Scene(game.engine)
    scene.clearColor = hex4('#0e1c2eff')

    const materials = {
        ground: new StandardMaterial('ground'),
        player: new StandardMaterial('player'),
        werewolf: new StandardMaterial('werewolf'),
    }

    materials.ground.diffuseColor = hex3('#136d15')
    materials.player.diffuseColor = hex3('#ffffff')
    materials.werewolf.diffuseColor = hex3('#735757')

    const {
        wizard,
        werewolf,
    } = await loadAssets(scene, assets)

    if (
        !wizard ||
        !werewolf
    ) throw ERROR_NO_MESH

    const ground = MeshBuilder.CreateGround('ground', {
        width: 20,
        height: 20,
    })

    const player = wizard

    ground.material = materials.ground
    player.material = materials.player
    werewolf.material = materials.werewolf

    const w1 = werewolf
    const w2 = w1.clone()

    w1.position = new Vector3(5.3, 0, -3.1)
    w1.rotation = new Vector3(0, -1, 0)
    w2.position = new Vector3(-1, 0, 7)
    w2.rotation = new Vector3(0, 2, 0)

    const light = new HemisphericLight('light', new Vector3(1, 1, 0))

    const alpha = .75
    const beta = 0.7
    const radius = 16
    const camera = new ArcFollowCamera('camera', alpha, beta, radius, player, scene)

    const walk = new Animation('walk', 'position', 30,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT)

    scene.onPointerDown = (_, info) => {
        const {
            pickedMesh,
            pickedPoint,
        } = info

        if (!pickedPoint) { return }
        if (!(pickedMesh instanceof GroundMesh)) { return }

        pickedPoint.y = 0

        walk.setKeys([
            {
                frame: 0,
                value: player.position,
            },
            {
                frame: 100,
                value: pickedPoint,
            },
        ])

        const { z: x1, x: y1 } = player.position
        const { z: x2, x: y2 } = pickedPoint

        const angle = Math.atan((y2 - y1) / (x2 - x1)) + (x1 > x2 ? Math.PI : 0)
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        const speedRatio = 5 / distance

        player.rotation = new Vector3(0, angle, 0)
        player.animations = [walk]

        scene.beginAnimation(player, 0, 100, false, speedRatio)
    }

    await scene.whenReadyAsync()

    return scene
}
