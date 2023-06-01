import { createContext } from "react"
import { Mesh, MeshStandardMaterial, Object3D, Texture } from "three"
import { GuiState } from "../components/Gui"

export class Editor {
    private selectedMesh: Mesh = null!
    private pointedMesh: Mesh = null!

    guiState: GuiState = null!

    onPointerOnMesh(mesh: Mesh) {
        if (this.pointedMesh !== mesh) {
            this.pointedMesh = mesh
        }
    }

    onPointerOffMesh(mesh: Mesh) {
        if (this.pointedMesh === mesh) {
            this.pointedMesh = null!
        }
    }

    onClickMesh(mesh: Mesh): void {
        this.setSelectedMesh(mesh)
        if (this.guiState)
            this.guiState.setActiveMenu('TextureMenu')
    }

    flashSelectedMesh(elapsedTime: number): void {
        if (this.selectedMesh) {
            const standardMaterial = this.selectedMesh.material as MeshStandardMaterial
            const pulse = (3 + Math.cos(elapsedTime * 8 * Math.PI)) / 4
            standardMaterial.color.setScalar(pulse)
        }
    }

    isMeshSelected(): boolean {
        return this.selectedMesh != null
    }

    setSelectedMeshTexture(texture: Texture) {
        if (this.selectedMesh) {
            const standardMaterial = this.selectedMesh.material as MeshStandardMaterial
            standardMaterial.map = texture
            standardMaterial.needsUpdate = true
        }
    }

    setSelectedMesh(mesh: Mesh) {
        if (this.selectedMesh) {
            const standardMaterial = this.selectedMesh.material as MeshStandardMaterial
            standardMaterial.color.set('white')
        }
        this.selectedMesh = mesh
    }

    private selectedObject: Object3D = null!

    onClickObject(object: Object3D): void {
        this.setSelectedObject(object)
        if (this.guiState)
            this.guiState.setActiveMenu('TextureMenu')
    }

    flashSelectedObject(elapsedTime: number): void {
        const pulse = (3 + Math.cos(elapsedTime * 8 * Math.PI)) / 4

        if (this.selectedObject) {
            this.editObjectMeshes(this.selectedObject, (mesh) => {
                const standardMaterial = mesh.material as MeshStandardMaterial
                if (standardMaterial.isMeshStandardMaterial) {
                    standardMaterial.color.setScalar(pulse)
                }
            })
        }
    }

    isObjectSelected() {
        return this.selectedObject != null
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
                    standardMaterial.color.set('white')
            })
        }
        this.selectedObject = object
    }
}

export const EditorContext = createContext(new Editor())