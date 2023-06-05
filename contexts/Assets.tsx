import { createContext } from "react";
import { TextureLoader, Texture, RepeatWrapping, SRGBColorSpace } from "three";

export class Assets {
    private textures = {}
    private textureLoader = new TextureLoader()

    getTexture(url: string): Texture {
        let texture = this.textures[url] as Texture
        if (!texture) {
            texture = this.textureLoader.load(url)
            texture.wrapS = texture.wrapT = RepeatWrapping
            texture.colorSpace = SRGBColorSpace
            this.textures[url] = texture
        }
        return texture
    }
}

export const AssetsContext = createContext(new Assets())