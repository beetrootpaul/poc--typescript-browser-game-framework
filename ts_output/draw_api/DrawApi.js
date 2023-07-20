var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DrawApi_assets, _DrawApi_clear, _DrawApi_pixel, _DrawApi_rect, _DrawApi_ellipse, _DrawApi_sprite, _DrawApi_text, _DrawApi_cameraOffset, _DrawApi_fillPattern, _DrawApi_fontAsset, _DrawApi_spriteColorMapping;
import { xy_ } from "../Xy";
import { DrawClear } from "./DrawClear";
import { DrawEllipse } from "./DrawEllipse";
import { DrawPixel } from "./DrawPixel";
import { DrawRect } from "./DrawRect";
import { DrawSprite } from "./DrawSprite";
import { DrawText } from "./DrawText";
import { FillPattern } from "./FillPattern";
export class DrawApi {
    constructor(options) {
        _DrawApi_assets.set(this, void 0);
        _DrawApi_clear.set(this, void 0);
        _DrawApi_pixel.set(this, void 0);
        _DrawApi_rect.set(this, void 0);
        _DrawApi_ellipse.set(this, void 0);
        _DrawApi_sprite.set(this, void 0);
        _DrawApi_text.set(this, void 0);
        _DrawApi_cameraOffset.set(this, xy_(0, 0));
        _DrawApi_fillPattern.set(this, FillPattern.primaryOnly);
        _DrawApi_fontAsset.set(this, null);
        _DrawApi_spriteColorMapping.set(this, new Map());
        __classPrivateFieldSet(this, _DrawApi_assets, options.assets, "f");
        __classPrivateFieldSet(this, _DrawApi_clear, new DrawClear(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_pixel, new DrawPixel(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_rect, new DrawRect(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_ellipse, new DrawEllipse(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_sprite, new DrawSprite(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_text, new DrawText(options.canvasBytes, options.canvasSize.round()), "f");
    }
    // TODO: cover it with tests, e.g. make sure that fill pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
    // noinspection JSUnusedGlobalSymbols
    setCameraOffset(offset) {
        __classPrivateFieldSet(this, _DrawApi_cameraOffset, offset.round(), "f");
    }
    // TODO: cover it with tests
    // noinspection JSUnusedGlobalSymbols
    setFillPattern(fillPattern) {
        __classPrivateFieldSet(this, _DrawApi_fillPattern, fillPattern, "f");
    }
    // TODO: cover it with tests
    // noinspection JSUnusedGlobalSymbols
    mapSpriteColor(from, to) {
        // TODO: consider writing a custom equality check function
        if (from.id() === to.id()) {
            __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f").delete(from.id());
        }
        else {
            __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f").set(from.id(), to);
        }
    }
    // TODO: cover it with tests
    // noinspection JSUnusedGlobalSymbols
    setCurrentFont(fontImageUrl) {
        __classPrivateFieldSet(this, _DrawApi_fontAsset, fontImageUrl ? __classPrivateFieldGet(this, _DrawApi_assets, "f").getFont(fontImageUrl) : null, "f");
    }
    // noinspection JSUnusedGlobalSymbols
    getFont() {
        return __classPrivateFieldGet(this, _DrawApi_fontAsset, "f")?.font ?? null;
    }
    // noinspection JSUnusedGlobalSymbols
    clear(color) {
        __classPrivateFieldGet(this, _DrawApi_clear, "f").draw(color);
    }
    // noinspection JSUnusedGlobalSymbols
    pixel(xy, color) {
        __classPrivateFieldGet(this, _DrawApi_pixel, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), color);
    }
    // noinspection JSUnusedGlobalSymbols
    rect(xy1, xy2, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy1.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), xy2.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), color, false, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    // noinspection JSUnusedGlobalSymbols
    rectFilled(xy1, xy2, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy1.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), xy2.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), color, true, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    // noinspection JSUnusedGlobalSymbols
    ellipse(xy1, xy2, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy1.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), xy2.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), color, false, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    // noinspection JSUnusedGlobalSymbols
    ellipseFilled(xy1, xy2, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy1.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), xy2.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), color, true, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    // TODO: make sprite make use of fillPattern as well, same as rect and ellipse etc.
    // noinspection JSUnusedGlobalSymbols
    sprite(spriteImageUrl, sprite, canvasXy1) {
        const sourceImageAsset = __classPrivateFieldGet(this, _DrawApi_assets, "f").getImage(spriteImageUrl);
        __classPrivateFieldGet(this, _DrawApi_sprite, "f").draw(sourceImageAsset, sprite, canvasXy1.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f"));
    }
    // TODO: cover with tests
    print(text, canvasXy1, color) {
        if (__classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) {
            __classPrivateFieldGet(this, _DrawApi_text, "f").draw(text, canvasXy1.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), __classPrivateFieldGet(this, _DrawApi_fontAsset, "f"), color);
        }
        else {
            console.info(`print: (${canvasXy1.x},${canvasXy1.y}) [${color.asRgbCssHex()}] ${text}`);
        }
    }
}
_DrawApi_assets = new WeakMap(), _DrawApi_clear = new WeakMap(), _DrawApi_pixel = new WeakMap(), _DrawApi_rect = new WeakMap(), _DrawApi_ellipse = new WeakMap(), _DrawApi_sprite = new WeakMap(), _DrawApi_text = new WeakMap(), _DrawApi_cameraOffset = new WeakMap(), _DrawApi_fillPattern = new WeakMap(), _DrawApi_fontAsset = new WeakMap(), _DrawApi_spriteColorMapping = new WeakMap();
