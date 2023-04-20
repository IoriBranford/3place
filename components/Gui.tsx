import { Dispatch, SetStateAction, createContext, useContext, useState } from "react"
import { EditorContext } from "../contexts/Editor"
import { SplashScreen } from "./SplashScreen"
import { TextureMenu } from "./TextureMenu"

export interface GuiState {
    activeMenu: string
    setActiveMenu: Dispatch<SetStateAction<string>>
}

export const GuiContext = createContext(null as GuiState)

export function Gui({ firstMenu = '' }) {
    const [activeMenu, setActiveMenu] = useState(firstMenu)
    const guiState = { activeMenu, setActiveMenu }

    const editor = useContext(EditorContext)
    editor.guiState = guiState

    return (
        <GuiContext.Provider value={guiState}>
            <SplashScreen />
            <TextureMenu />
        </GuiContext.Provider>
    )
}