"use strict";
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
var _DrawText_canvasBytes, _DrawText_canvasSize, _DrawText_sprite;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawText = void 0;
const Color_1 = require("../Color");
const DrawSprite_1 = require("./DrawSprite");
class DrawText {
    constructor(canvasBytes, canvasSize) {
        _DrawText_canvasBytes.set(this, void 0);
        _DrawText_canvasSize.set(this, void 0);
        _DrawText_sprite.set(this, void 0);
        __classPrivateFieldSet(this, _DrawText_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawText_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawText_sprite, new DrawSprite_1.DrawSprite(__classPrivateFieldGet(this, _DrawText_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawText_canvasSize, "f")), "f");
    }
    // TODO: tests, especially to check that we iterate over emojis like "➡️" correctly
    draw(text, canvasXy1, fontAsset, color) {
        for (const charSprite of fontAsset.font.spritesFor(text)) {
            __classPrivateFieldGet(this, _DrawText_sprite, "f").draw(fontAsset.image, charSprite.sprite, canvasXy1.add(charSprite.positionInText), new Map([
                [fontAsset.imageTextColor.id(), color],
                [fontAsset.imageBgColor.id(), Color_1.transparent],
            ]));
        }
    }
}
exports.DrawText = DrawText;
_DrawText_canvasBytes = new WeakMap(), _DrawText_canvasSize = new WeakMap(), _DrawText_sprite = new WeakMap();
