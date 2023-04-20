import { createContext, useContext, useState } from "react"
import { EditorContext } from "../contexts/Editor"
import { SplashScreen } from "./SplashScreen"
import { TextureMenu } from "./TextureMenu"

export const GuiContext = createContext(null)

export function Gui({ firstMenu = '' }) {
    const editor = useContext(EditorContext)
    const [activeMenu, setActiveMenu] = useState(firstMenu)
    editor.setActiveMenu = setActiveMenu

    const guiState = { activeMenu, setActiveMenu }
    return (
        <GuiContext.Provider value={guiState}>
            <SplashScreen />
            <TextureMenu />
        </GuiContext.Provider>
    )
}