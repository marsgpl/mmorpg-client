import {
    ArcFollowCamera,
    HemisphericLight,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3,
    Animation,
    GroundMesh,
} from '@babylonjs/core'
import { Game } from '../class/Game'
import { hex3, hex4 } from '../helper/color'
import { loadAssets } from '../helper/loadAssets'
import { GrassProceduralTexture } from '@babylonjs/procedural-textures'
import { Player } from '../entity/Player'
import { Werewolf } from '../entity/Werewolf'

const GROUND_SIZE = 128

export async function city(game: Game) {
    const scene = new Scene(game.engine)
    scene.clearColor = hex4('#0e1c2eff')

    const ground = MeshBuilder.CreateGround('ground', {
        width: GROUND_SIZE,
        height: GROUND_SIZE,
    })
    const groundMaterial = new StandardMaterial('ground')
    groundMaterial.diffuseColor = hex3('#136d15')
    groundMaterial.ambientTexture = new GrassProceduralTexture('grass', GROUND_SIZE * 16)
    ground.material = groundMaterial

    const light = new HemisphericLight('light', new Vector3(1, 1, 0))

    const assets = await loadAssets(scene, {
        wizard: 'wizard.glb',
        werewolf: 'werewolf.glb',
    })

    const scale = new Vector3(100, 100, -100)

    const player = new Player({
        name: 'player',
        asset: assets.get('wizard'),
        scale,
    })

    player.idle()
    player.getMesh().position = new Vector3(3.425, 0, 3.5)
    player.getMesh().rotation = new Vector3(0, 1.4, 0)

    const wws = Array.from(Array(3), (_, i) => new Werewolf({
        name: `werewolf:${i + 1}`,
        asset: assets.get('werewolf'),
        scale,
    }))

    const wwsGeo = [
        [5.3, 0, -3.1, 0, -1, 0],
        [-1, 0, 7, 0, 2, 0],
    ]

    wws.forEach((ww, i) => {
        const mesh = ww.getMesh()
        const [p1, p2, p3, r1, r2, r3] = wwsGeo[i] || []
        mesh.position = new Vector3(p1, p2, p3)
        mesh.rotation = new Vector3(r1, r2, r3)
        ww.idle()
    })

    const alpha = Math.PI / 4
    const beta = .7
    const radius = 14
    const camera = new ArcFollowCamera('camera', alpha, beta, radius, player.getMesh(), scene)

    const move = new Animation('move', 'position', 30,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT)

    const movePlayerTo = (pickedPoint: Vector3) => {
        const playerMesh = player.getMesh()
        const playerPoint = playerMesh.position

        move.setKeys([
            {
                frame: 0,
                value: playerPoint,
            },
            {
                frame: 100,
                value: pickedPoint,
            },
        ])

        const { z: x1, x: y1 } = playerPoint
        const { z: x2, x: y2 } = pickedPoint

        const angle = Math.atan((y2 - y1) / (x2 - x1)) + (x1 < x2 ? Math.PI : 0)
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        const speedRatio = 7 / distance

        playerMesh.rotation = new Vector3(0, angle, 0)
        playerMesh.animations = [move]

        const walkId = player.walk()

        scene.beginAnimation(playerMesh, 0, 100, false, speedRatio, () => {
            if (walkId !== player.getCurrentWalkId()) { return }
            player.idle()
        })
    }

    scene.onPointerDown = (_, info) => {
        const {
            pickedMesh,
            pickedPoint,
        } = info

        if (!pickedPoint) { return }

        pickedPoint.y = 0

        if (pickedMesh instanceof GroundMesh) {
            return movePlayerTo(pickedPoint)
        }

        const pickedName10 = pickedMesh?.name.substring(0, 10)

        if (pickedName10 === 'werewolf:1') {
            player.die()
        } else if (pickedName10 === 'werewolf:2') {
            player.hit()
            wws[1]?.die()
        }
    }

    await scene.whenReadyAsync()

    return scene
}
