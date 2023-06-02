import { Plane } from "@react-three/drei"
import { useContext, useLayoutEffect, useRef } from "react"
import { AssetsContext } from "../contexts/Assets"
import { BufferAttribute, Mesh, Object3D } from "three"

function RegularConvexRoom({ wallCount = 4, apothem = 2, height = 1, imageUrl = '' }) {
    const object3d = useRef<Object3D>(null!)
    const assets = useContext(AssetsContext)
    useLayoutEffect(() => {
        let width = apothem * 2 * Math.tan(Math.PI / wallCount)
        object3d.current.children.map((wall: Mesh, i) => {
            const uv = wall.geometry.getAttribute('uv') as BufferAttribute
            uv.setXY(0, 0, height)
            uv.setXY(1, width, height)
            uv.setXY(2, 0, 0)
            uv.setXY(3, width, 0)
        })
    })
    const texture = imageUrl == '' ? null : assets.getTexture(imageUrl)

    /*
        The circumradius R from the center of a regular polygon
        to one of the vertices is related to the side length s or
        to the apothem a by
    
        R = s / (2*sin(PI/n)) = a / (cos(PI/n))
        a = s / (2*tan(PI/n))
    */

    let angle = -Math.PI
    let deltaAngle = 2 * Math.PI / wallCount
    let wallWidth = apothem * 2 * Math.tan(Math.PI / wallCount)
    let walls: JSX.Element[] = []
    let material = <meshStandardMaterial map={texture} />
    for (let i = 0; i < wallCount; ++i) {
        const x = -Math.cos(angle) * apothem
        const y = height / 2 - .5
        const z = -Math.sin(angle) * apothem
        walls.push(
            <Plane position={[x, y, z]} rotation={[0, angle, 0]}
                args={[wallWidth, height]}>
                {material}
            </Plane>
        )
        angle += deltaAngle;
    }
    return walls
}
