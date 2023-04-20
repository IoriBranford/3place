import { useContext, useRef, CSSProperties } from "react"
import Image from "next/image"
import { EditorContext } from "../contexts/Editor"
import { ControlsContext } from "../contexts/Controls"
import { AssetsContext } from "../contexts/Assets"

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
    const editor = useContext(EditorContext)
    const controls = useContext(ControlsContext)
    const assets = useContext(AssetsContext)
    let self = useRef<HTMLDivElement>(null!)
    let style = { position: 'absolute', left: 0, top: 0, height: 'auto' } as CSSProperties
    function onTextureClick(image: string) {
        const texture = assets.getTexture(image)
        editor.setSelectedMeshTexture(texture)
        editor.setSelectedMesh(null)
        controls.setEnabled(true)
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