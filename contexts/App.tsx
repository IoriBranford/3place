import { MutableRefObject, createContext } from "react";
import { Mesh, MeshStandardMaterial, RepeatWrapping, Texture, TextureLoader } from "three";
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';

export class App {
    private selectedMesh: Mesh = null!
    private firstPersonControls: MutableRefObject<FirstPersonControlImpl> = null!
    private textures = {}
    private textureLoader = new TextureLoader()

    constructor(controls: MutableRefObject<FirstPersonControlImpl>) {
        this.firstPersonControls = controls
    }

    setControlsEnabled(enabled: boolean): void {
        this.firstPersonControls.current.enabled = enabled
    }

    onClickMesh(mesh: Mesh): void {
        this.setSelectedMesh(this.selectedMesh == mesh ? null : mesh)
        // textureSelector.current.visible = (this.clickedObject != null)
        if (this.firstPersonControls.current)
            this.firstPersonControls.current.enabled = (this.selectedMesh == null)
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

    getTexture(url:string): Texture {
        let texture = this.textures[url] as Texture
        if (!texture) {
            texture = this.textureLoader.load(url)
            texture.wrapS = texture.wrapT = RepeatWrapping
            this.textures[url] = texture
        }
        return texture
    }

    setSelectedMeshTexture(image: string) {
        if (this.selectedMesh) {
            const standardMaterial = this.selectedMesh.material as MeshStandardMaterial
            standardMaterial.map = this.getTexture(image)
            standardMaterial.needsUpdate = true
        }
    }

    setSelectedMesh(mesh:Mesh) {
        if (this.selectedMesh) {
            const standardMaterial = this.selectedMesh.material as MeshStandardMaterial
            standardMaterial.color.set('white')
        }
        this.selectedMesh = mesh
    }
}

export const AppContext = createContext(new App(null))
