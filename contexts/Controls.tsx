import { MutableRefObject, createContext } from "react";
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';

export class Controls {
    private controls: MutableRefObject<FirstPersonControlImpl> = null!

    constructor(controls:MutableRefObject<FirstPersonControlImpl>) {
        this.controls = controls
    }

    setEnabled(enabled:boolean) {
        if (this.controls && this.controls.current)
            this.controls.current.enabled = enabled
    }
}

export const ControlsContext = createContext(new Controls(null))