import { useContext, CSSProperties } from "react"
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
    if (gui.activeMenu != 'TextureMenu') {
        return <></>
    }
    const style = { position: 'absolute', left: 0, top: 0, height: 'auto' } as CSSProperties
    function onTextureClick(url: string) {
        const texture = assets.getTexture(url)
        editor.setSelectedObjectTexture(texture, url)
    }
    function onCloseClick() {
        editor.setSelectedObject(null!)
        gui.setActiveMenu('')
    }
    return (
        <div style={style}>
            {
                AllTextures.map((url) => (
                    <Image key={url} src={url} alt={url} width={64} height={64} onClick={() => onTextureClick(url)} />
                ))
            }
            <br/>
            <button onClick={onCloseClick}>Done</button>
        </div>
    )
}