export type AssetsToLoad = {
  images: AssetToLoad[];
};

type AssetToLoad = {
  url: string;
};

type ImageAsset = {
  width: number;
  height: number;
  rgba8bitData: Uint8ClampedArray;
};

export class Assets {
  // key: url
  #images: Map<string, ImageAsset> = new Map();

  // TODO: game loading screen during assets loading?
  async loadImages(imagesToLoad: AssetsToLoad["images"]): Promise<void> {
    await Promise.all(
      imagesToLoad.map(async ({ url }) => {
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
  getImage(urlOfAlreadyLoadedImage: string): ImageAsset {
    const imageAsset = this.#images.get(urlOfAlreadyLoadedImage);
    if (!imageAsset) {
      // TODO: refine this error message
      throw Error(`There is no image loaded for: ${urlOfAlreadyLoadedImage}`);
    }
    return imageAsset;
  }
}
