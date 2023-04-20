import { Dispatch, SetStateAction, createContext } from "react"
import { Mesh, MeshStandardMaterial, Texture } from "three"

export class Editor {
    private selectedMesh: Mesh = null
    private pointedMesh: Mesh = null

    setActiveMenu: Dispatch<SetStateAction<string>>

    onPointerOnMesh(mesh: Mesh) {
        if (this.pointedMesh !== mesh) {
            this.pointedMesh = mesh
        }
    }

    onPointerOffMesh(mesh: Mesh) {
        if (this.pointedMesh === mesh) {
            this.pointedMesh = null
        }
    }

    onClickMesh(mesh: Mesh): void {
        this.setSelectedMesh(mesh)
        if (this.setActiveMenu)
            this.setActiveMenu('TextureMenu')
    }

    flashSelectedMesh(elapsedTime: number): void {
        if (this.selectedMesh) {
            const standardMaterial = this.selectedMesh.material as MeshStandardMaterial
            const pulse = (3 + Math.cos(elapsedTime * 8 * Math.PI)) / 4
            standardMaterial.color.setScalar(pulse)
        }
    }

    isMeshSelected() : boolean {
        return this.selectedMesh != null
    }

    setSelectedMeshTexture(texture:Texture) {
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
}

export const EditorContext = createContext(new Editor())