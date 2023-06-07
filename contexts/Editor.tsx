import { createContext } from "react"
import { Mesh, MeshStandardMaterial, Object3D, Texture } from "three"
import { GuiState } from "../components/Gui"
import { ThreeEvent } from "@react-three/fiber"

class Editor {
    guiState: GuiState = null!

    private _selectedObject: Object3D = null!
    get selectedObject() {
        return this._selectedObject
    }
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
        const userData = object.userData
        let nextMenu = userData.contextMenu ? userData.contextMenu : ''
        if (this.guiState)
            this.guiState.setActiveMenu(nextMenu)
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

    isSelectedObjectForSurface(surfaceName: string) {
        return this.isObjectSelected() && this.selectedObject.userData.forSurface === surfaceName
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
        this._selectedObject = object
    }

    onPointerMoveSurface(surface: Object3D, event: ThreeEvent<MouseEvent>) {
        const object = this.selectedObject
        if (this.isSelectedObjectForSurface(surface.userData.surfaceType)) {
            const intersection = event.intersections[0]
            if (intersection) {
                const movement = object.worldToLocal(intersection.point)
                object.translateX(movement.x)
                object.translateY(movement.y)
                object.translateZ(movement.z)
            }
        }
    }
}

export const EditorContext = createContext(new Editor())