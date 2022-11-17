"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author      Austyn Studdard <cosmic@bardsballad.com>
 */
var phaser_1 = __importDefault(require("phaser"));
var fragShader = "\n#define SHADER_NAME COLOR_SWAP\n\nprecision highp int;\nprecision highp float;\n\nuniform sampler2D uMainSampler;\nuniform sampler2D uSecondarySampler;\nuniform float uvSize;\nuniform vec2 uResolution;\n\nvarying vec2 outTexCoord;\n\nvoid main ()\n{\n  vec4 imgColor = texture2D(uMainSampler,  outTexCoord);\n\n  vec2 pos = (imgColor.rg * 255.0) / uvSize;\n\n  gl_FragColor = texture2D(uSecondarySampler, pos);\n  gl_FragColor.a = imgColor.a;\n}\n";
var UVPipeline = /** @class */ (function (_super) {
    __extends(UVPipeline, _super);
    function UVPipeline(game, texture) {
        var _this = _super.call(this, {
            game: game,
            fragShader: fragShader
        }) || this;
        _this.uvSize = 15;
        _this.texture = texture;
        _this.changeDefaultUVTexture(_this.texture);
        return _this;
    }
    UVPipeline.prototype.changeDefaultUVTexture = function (texture) {
        var phaserTexture = this.game.textures.getFrame(texture);
        if (phaserTexture) {
            this.defaultTexture = phaserTexture.glTexture;
        }
    };
    UVPipeline.prototype.bindAndDraw = function (source) {
        var gl = this.gl;
        var renderer = this.renderer;
        this.set1i('uMainSampler', 0);
        this.set1i('uSecondarySampler', 1);
        this.set1f('uvSize', this.uvSize);
        renderer.popFramebuffer(false, false, false);
        if (!renderer.currentFramebuffer) {
            gl.viewport(0, 0, renderer.width, renderer.height);
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        // @ts-ignore
        var matrix = this._tempMatrix1.loadIdentity();
        // @ts-ignore
        var x = this.targetBounds.x;
        // @ts-ignore
        var y = this.targetBounds.y;
        var xw = x + source.width;
        var yh = y + source.height;
        var x0 = matrix.getX(x, y);
        var x1 = matrix.getX(x, yh);
        var x2 = matrix.getX(xw, yh);
        var x3 = matrix.getX(xw, y);
        //  Regular verts
        var y0 = matrix.getY(x, y);
        var y1 = matrix.getY(x, yh);
        var y2 = matrix.getY(xw, yh);
        var y3 = matrix.getY(xw, y);
        //  Flip verts:
        // var y0 = matrix.getY(x, yh);
        // var y1 = matrix.getY(x, y);
        // var y2 = matrix.getY(xw, y);
        // var y3 = matrix.getY(xw, yh);
        this.batchVert(x0, y0, 0, 0, 0, 0, 0xffffff);
        this.batchVert(x1, y1, 0, 1, 0, 0, 0xffffff);
        this.batchVert(x2, y2, 1, 1, 0, 0, 0xffffff);
        this.batchVert(x0, y0, 0, 0, 0, 0, 0xffffff);
        this.batchVert(x2, y2, 1, 1, 0, 0, 0xffffff);
        this.batchVert(x3, y3, 1, 0, 0, 0, 0xffffff);
        this.flush();
        renderer.resetTextures();
        // No hanging references
        // @ts-ignore
        this.tempSprite = null;
    };
    UVPipeline.prototype.onPreRender = function () { };
    UVPipeline.prototype.onDraw = function (target) {
        this.drawToGame(target);
    };
    UVPipeline.prototype.onDrawSprite = function (gameObject, target) {
        // @ts-ignore
        if (!gameObject.lookupTexture)
            return this.glTexture = this.defaultTexture;
        // @ts-ignore
        if (!gameObject.uvSize)
            return this.uvSize = 15;
        // @ts-ignore
        this.glTexture = gameObject.lookupTexture;
        // @ts-ignore
        this.uvSize = gameObject.uvSize;
    };
    return UVPipeline;
}(phaser_1.default.Renderer.WebGL.Pipelines.SpriteFXPipeline));
exports.default = UVPipeline;
