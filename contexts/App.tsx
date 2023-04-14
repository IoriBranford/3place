import { MutableRefObject, createContext } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';

export class App {
    selectedMesh: Mesh = null!
    firstPersonControls: MutableRefObject<FirstPersonControlImpl> = null!

    constructor(controls: MutableRefObject<FirstPersonControlImpl>) {
        this.firstPersonControls = controls
    }

    setControlsEnabled(enabled:boolean) : void {
        this.firstPersonControls.current.enabled = enabled
    }
    
    onClickMesh(mesh: Mesh): void {
        if (this.selectedMesh) {
            const standardMaterial = this.selectedMesh.material as MeshStandardMaterial
            standardMaterial.color.set('white')
        }
        this.selectedMesh = (this.selectedMesh == mesh ? null : mesh)
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
}

export const AppContext = createContext(new App(null))
