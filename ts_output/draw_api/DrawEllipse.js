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
var _DrawEllipse_canvasBytes, _DrawEllipse_canvasSize, _DrawEllipse_pixel;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawEllipse = void 0;
const Xy_1 = require("../Xy");
const DrawPixel_1 = require("./DrawPixel");
const FillPattern_1 = require("./FillPattern");
class DrawEllipse {
    constructor(canvasBytes, canvasSize) {
        _DrawEllipse_canvasBytes.set(this, void 0);
        _DrawEllipse_canvasSize.set(this, void 0);
        _DrawEllipse_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawEllipse_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawEllipse_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawEllipse_pixel, new DrawPixel_1.DrawPixel(__classPrivateFieldGet(this, _DrawEllipse_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawEllipse_canvasSize, "f")), "f");
    }
    // TEST: for switched order of xy1 and xy2 (and soltion maybe this? -> [xy1,xy2]=[Math.min(…),Math.max(…)]
    // Based on https://github.com/aseprite/aseprite/blob/25fbe786f8353a2ddb57de3bcc5db00066cc9ca6/src/doc/algo.cpp#L216-L315
    draw(xy1, xy2, color, fill, fillPattern = FillPattern_1.FillPattern.primaryOnly) {
        if (Math.abs(xy2.x - xy1.x) <= 0 || Math.abs(xy2.y - xy1.y) <= 0) {
            return;
        }
        let x0 = Math.min(xy1.x, xy2.x);
        let x1 = Math.max(xy1.x, xy2.x) - 1;
        let y0 = Math.min(xy1.y, xy2.y);
        let y1 = Math.max(xy1.y, xy2.y) - 1;
        const h = y1 - y0 + 1;
        // diameter
        let a = Math.abs(x1 - x0);
        let b = Math.abs(y1 - y0);
        let b1 = b & 1;
        // error increments
        let dx = 4 * (1 - a) * b * b;
        let dy = 4 * (b1 + 1) * a * a;
        // error of 1.step
        let err = dx + dy + b1 * a * a;
        let e2;
        y0 += Math.floor((b + 1) / 2);
        // starting pixel
        y1 = y0 - b1;
        a = 8 * a * a;
        b1 = 8 * b * b;
        while (true) {
            // TODO: update the implementation below to honor fill pattern
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Xy_1.xy_)(x1, y0), color); //   I. Quadrant
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Xy_1.xy_)(x0, y0), color); //  II. Quadrant
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Xy_1.xy_)(x0, y1), color); // III. Quadrant
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Xy_1.xy_)(x1, y1), color); //  IV. Quadrant
            if (fill) {
                // TODO: update the implementation below to honor fill pattern
                //  I. & II. Quadrant
                Xy_1.Xy.forEachIntXyWithinRectOf((0, Xy_1.xy_)(x0 + 1, y0), (0, Xy_1.xy_)(x1 - 1, y0).add(1), true, (xy) => {
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(xy, color);
                });
                // TODO: update the implementation below to honor fill pattern
                //  III. & IV. Quadrant
                Xy_1.Xy.forEachIntXyWithinRectOf((0, Xy_1.xy_)(x0 + 1, y1), (0, Xy_1.xy_)(x1 - 1, y1).add(1), true, (xy) => {
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(xy, color);
                });
            }
            e2 = 2 * err;
            // y step
            if (e2 <= dy) {
                y0 += 1;
                y1 -= 1;
                dy += a;
                err += dy;
            }
            // x step
            if (e2 >= dx || 2 * err > dy) {
                x0 += 1;
                x1 -= 1;
                dx += b1;
                err += dx;
            }
            if (x0 > x1) {
                break;
            }
        }
        // TODO: cover this with tests
        while (y0 - y1 < h) {
            // TODO: update the implementation below to honor fill pattern
            // too early stop of flat ellipses a=1
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Xy_1.xy_)(x0 - 1, y0), color);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Xy_1.xy_)(x1 + 1, y0), color);
            y0 += 1;
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Xy_1.xy_)(x0 - 1, y1), color);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Xy_1.xy_)(x1 + 1, y1), color);
            y1 -= 1;
        }
    }
}
exports.DrawEllipse = DrawEllipse;
_DrawEllipse_canvasBytes = new WeakMap(), _DrawEllipse_canvasSize = new WeakMap(), _DrawEllipse_pixel = new WeakMap();
