import { Dispatch, SetStateAction, createContext, useContext, useState } from "react"
import { EditorContext } from "../contexts/Editor"
import { TextureMenu } from "./TextureMenu"
import AuthScreen from "./AuthScreen"

export interface GuiState {
    activeMenu: string
    setActiveMenu: Dispatch<SetStateAction<string>>
}

export const GuiContext = createContext<GuiState>(null!)

export function Gui({ firstMenu = '' }) {
    const [activeMenu, setActiveMenu] = useState(firstMenu)
    const guiState = { activeMenu, setActiveMenu }

    const editor = useContext(EditorContext)
    editor.guiState = guiState

    return (
        <GuiContext.Provider value={guiState}>
            <AuthScreen />
            <TextureMenu />
        </GuiContext.Provider>
    )
}