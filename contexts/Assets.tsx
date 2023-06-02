import { useLoader } from "@react-three/fiber";
import { createContext } from "react";
import { TextureLoader, Texture, RepeatWrapping, sRGBEncoding } from "three";

export class Assets {
    getTexture(url: string): Texture {
        let texture = useLoader(TextureLoader, url)
        if (texture) {
            texture.wrapS = texture.wrapT = RepeatWrapping
            texture.encoding = sRGBEncoding
        }
        return texture
    }
}

export const AssetsContext = createContext(new Assets())