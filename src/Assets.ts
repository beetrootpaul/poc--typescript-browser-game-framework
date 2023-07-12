import { Font } from "./font/Font.ts";
import { Utils } from "./Utils.ts";

export type AssetsToLoad = {
  images: ImageAssetToLoad[];
  fonts: FontAssetToLoad[];
};

type ImageUrl = string;

type ImageAssetToLoad = {
  url: ImageUrl;
};

type FontAssetToLoad = {
  url: ImageUrl;
  font: Font;
};

export type ImageAsset = {
  width: number;
  height: number;
  rgba8bitData: Uint8ClampedArray;
};

export type FontAsset = {
  font: Font;
  image: ImageAsset;
};

export class Assets {
  #images: Map<ImageUrl, ImageAsset> = new Map();
  #fonts: Map<ImageUrl, Font> = new Map();

  // TODO: game loading screen during assets loading?
  async loadAssets(assetsToLoad: AssetsToLoad): Promise<void> {
    assetsToLoad.fonts.forEach(({ url, font }) => {
      this.#fonts.set(url, font);
    });

    const imageUrls = [
      ...assetsToLoad.images.map(({ url }) => url),
      ...assetsToLoad.fonts.map(({ url }) => url),
    ];
    await Promise.all(
      imageUrls.map(async (url) => {
        const htmlImage = new Image();
        htmlImage.src = url;
        await htmlImage.decode();
        const canvas = document.createElement("canvas");
        canvas.width = htmlImage.naturalWidth;
        canvas.height = htmlImage.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw Error(`Failed to process the image: ${htmlImage.src}`);
        }
        ctx.drawImage(htmlImage, 0, 0);
        const imageData: ImageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        this.#images.set(url, {
          width: imageData.width,
          height: imageData.height,
          rgba8bitData: imageData.data,
        });
      })
    );
  }

  // call `loadImages` before this one
  getImage(urlOfAlreadyLoadedImage: ImageUrl): ImageAsset {
    const imageAsset = this.#images.get(urlOfAlreadyLoadedImage);
    if (!imageAsset) {
      // TODO: refine this error message
      throw Error(`There is no image loaded for: ${urlOfAlreadyLoadedImage}`);
    }
    return imageAsset;
  }

  // call `loadImages` before this one
  getFont(urlOfAlreadyLoadedFontImage: ImageUrl): FontAsset {
    return {
      font:
        this.#fonts.get(urlOfAlreadyLoadedFontImage) ??
        Utils.throwError(
          `Assets: font descriptor is missing for font image URL "${urlOfAlreadyLoadedFontImage}"`
        ),
      image: this.getImage(urlOfAlreadyLoadedFontImage),
    };
  }
}
