import { useContext, useRef, CSSProperties, useState } from "react"
import { AppContext } from "../contexts/App"
import Image from "next/image"

const AllTextures = [
    '/basket.png',
    '/bear.png',
    '/bricks.png',
    '/camo.png',
    '/cardboard.png',
    '/cheetah.png',
    '/cow.png',
    '/crystal.png',
    '/fire.png',
    '/fish.png',
    '/giraffe.png',
    '/mattress.png',
    '/metal.png',
    '/plaid.png',
    '/redcurtain.png',
    '/rock.png',
    '/sky.png',
    '/tiger.png',
    '/wood.png',
    '/zebra.png'
]

export function TextureMenu() {
    let app = useContext(AppContext)
    let self = useRef<HTMLDivElement>(null!)
    let style = { position: 'absolute', left: 0, top: 0, height: 'auto' } as CSSProperties
    function onTextureClick(image: string) {
        app.setSelectedMeshTexture(image)
        app.setSelectedMesh(null)
        app.setControlsEnabled(true)
        // self.current.remove()
    }
    // if (!app.isMeshSelected()) {
    //     return <></>
    // }
    return (
        <div ref={self} style={style}>
            {
                AllTextures.map((image) => (
                    <Image src={image} alt={image} width={64} height={64} onClick={() => onTextureClick(image)} />
                ))
            }
        </div>
    )
}