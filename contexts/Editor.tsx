import { createContext } from "react"
import { Mesh, MeshStandardMaterial, Object3D, Texture, Vector3 } from "three"
import { GuiState } from "../components/Gui"

class Editor {
    guiState: GuiState = null!
    cellSize = 0.5

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
        let nextMenu = ''
        if (object == this.selectedObject) {
            this.setSelectedObject(null!)
        } else {
            this.setSelectedObject(object)
            const userData = object.userData
            if (userData.contextMenu)
                nextMenu = userData.contextMenu
        }
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

    setSelectedObjectTexture(texture: Texture, url: string) {
        if (this.selectedObject) {
            this.selectedObject.userData.textureUrl = url
            this.editObjectMeshes(this.selectedObject, (mesh) => {
                const standardMaterial = mesh.material as MeshStandardMaterial
                if (standardMaterial.isMeshStandardMaterial) {
                    standardMaterial.map = texture
                }
            })
        }
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

    isMovingRoomObject(object: Object3D, surfaceType = object?.userData?.forSurface) {
        return this.selectedObject == object && surfaceType && this.isSelectedObjectForSurface(surfaceType)
    }

    setSelectedObjectPosition(position: Vector3) {
        const gridSnappedPosition = position.clone()
        gridSnappedPosition.x = Math.floor(gridSnappedPosition.x / this.cellSize) * this.cellSize
        // point.y = Math.floor(point.y / this.cellSize) * this.cellSize
        gridSnappedPosition.z = Math.floor(gridSnappedPosition.z / this.cellSize) * this.cellSize
        position = gridSnappedPosition

        const movement = this.selectedObject.worldToLocal(position)
        this.selectedObject.translateX(movement.x)
        this.selectedObject.translateY(movement.y)
        this.selectedObject.translateZ(movement.z)
    }
}

export const EditorContext = createContext(new Editor())