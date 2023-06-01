import { useContext, useRef, CSSProperties } from "react"
import Image from "next/image"
import { EditorContext } from "../contexts/Editor"
import { AssetsContext } from "../contexts/Assets"
import { GuiContext } from "./Gui"

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
    const gui = useContext(GuiContext)
    const editor = useContext(EditorContext)
    const assets = useContext(AssetsContext)
    const self = useRef<HTMLDivElement>(null!)
    if (gui.activeMenu != 'TextureMenu') {
        return <></>
    }
    const style = { position: 'absolute', left: 0, top: 0, height: 'auto' } as CSSProperties
    function onTextureClick(image: string) {
        const texture = assets.getTexture(image)
        editor.setSelectedObjectTexture(texture)
    }
    function onCloseClick() {
        editor.setSelectedObject(null!)
        gui.setActiveMenu('')
    }
    return (
        <div ref={self} style={style}>
            {
                AllTextures.map((image) => (
                    <Image key={image} src={image} alt={image} width={64} height={64} onClick={() => onTextureClick(image)} />
                ))
            }
            <br/>
            <button onClick={onCloseClick}>Done</button>
        </div>
    )
}