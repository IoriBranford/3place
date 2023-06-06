import { createContext } from "react"
import { Mesh, MeshStandardMaterial, Object3D, Texture } from "three"
import { GuiState } from "../components/Gui"

class Editor {
    guiState: GuiState = null!

    private selectedObject: Object3D = null!
    private pointedObject: Object3D = null!

    onPointerOnObject(object: Object3D) {
        if (this.pointedObject !== object) {
            this.pointedObject = object
        }
    }

    onPointerOffObject(object: Object3D) {
        if (this.pointedObject === object) {
            this.pointedObject = null!
        }
    }

    onClickObject(object: Object3D): void {
        this.setSelectedObject(object)
        if (this.guiState)
            this.guiState.setActiveMenu('TextureMenu')
    }

    flashSelectedObject(elapsedTime: number): void {
        const pulse = (1 + Math.cos(elapsedTime * 8 * Math.PI)) / 64

        if (this.selectedObject) {
            this.editObjectMeshes(this.selectedObject, (mesh) => {
                const standardMaterial = mesh.material as MeshStandardMaterial
                if (standardMaterial.isMeshStandardMaterial) {
                    standardMaterial.emissive.setScalar(pulse)
                }
            })
        }
    }

    isObjectSelected() {
        return this.selectedObject != null
    }

    isSelectionRoomObject() {
        // TODO: how do you tell a room object from wall, floor, etc.
        return this.isObjectSelected()
    }

    editObjectMeshes(object: Object3D, edit: (m: Mesh) => void) {
        const mesh = object as Mesh
        if (mesh.isMesh) {
            edit(mesh)
        } else {
            object.children.forEach((child) => this.editObjectMeshes(child, edit))
        }
    }

    setSelectedObjectTexture(texture: Texture) {
        if (this.selectedObject)
            this.editObjectMeshes(this.selectedObject, (mesh) => {
                const standardMaterial = mesh.material as MeshStandardMaterial
                if (standardMaterial.isMeshStandardMaterial) {
                    standardMaterial.map = texture
                    standardMaterial.needsUpdate = true
                }
            })
    }

    setSelectedObject(object: Object3D) {
        if (this.selectedObject) {
            this.editObjectMeshes(this.selectedObject, (mesh) => {
                const standardMaterial = mesh.material as MeshStandardMaterial
                if (standardMaterial.isMeshStandardMaterial)
                    standardMaterial.emissive.set('black')
            })
        }
        this.selectedObject = object
    }
}

export const EditorContext = createContext(new Editor())