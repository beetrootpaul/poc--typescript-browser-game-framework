"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestImage = void 0;
const Color_1 = require("../Color");
class TestImage {
    constructor(params) {
        const asciiImage = params.image;
        const asciiToColor = params.withMapping;
        const normalizedAsciiImageLines = asciiImage
            .trim()
            .split("\n")
            .map((line) => line
            .trim()
            .split("")
            .filter((char) => char !== " ")
            .join(""))
            .filter((line) => line.length > 0);
        const normalizedAsciiImage = normalizedAsciiImageLines.join("");
        this.asset = {
            width: normalizedAsciiImageLines[0].length,
            height: normalizedAsciiImageLines.length,
            rgba8bitData: new Uint8ClampedArray(4 * normalizedAsciiImage.length),
        };
        for (let i = 0; i < this.asset.width * this.asset.height; i += 1) {
            const color = asciiToColor[normalizedAsciiImage[i]];
            if (!color) {
                throw Error(`TestImage: Missing color mapping for "${normalizedAsciiImage[i]}"`);
            }
            else if (color instanceof Color_1.SolidColor) {
                this.asset.rgba8bitData[4 * i] = color.r;
                this.asset.rgba8bitData[4 * i + 1] = color.g;
                this.asset.rgba8bitData[4 * i + 2] = color.b;
                this.asset.rgba8bitData[4 * i + 3] = 0xff;
            }
            else {
                this.asset.rgba8bitData[4 * i] = 0x00;
                this.asset.rgba8bitData[4 * i + 1] = 0x00;
                this.asset.rgba8bitData[4 * i + 2] = 0x00;
                this.asset.rgba8bitData[4 * i + 3] = 0x00;
            }
        }
    }
}
exports.TestImage = TestImage;
