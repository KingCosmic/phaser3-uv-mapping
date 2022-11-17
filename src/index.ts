/**
 * @author      Austyn Studdard <cosmic@bardsballad.com>
 */
import Phaser from 'phaser'

const fragShader = `
#define SHADER_NAME COLOR_SWAP

precision highp int;
precision highp float;

uniform sampler2D uMainSampler;
uniform sampler2D uSecondarySampler;
uniform float uvWidth;
uniform float uvHeight;
uniform vec2 uResolution;

varying vec2 outTexCoord;

void main ()
{
  vec4 imgColor = texture2D(uMainSampler,  outTexCoord);

  vec2 pos = (imgColor.rg * 255.0) / 255.0;

  gl_FragColor = texture2D(uSecondarySampler, pos);
  gl_FragColor.a = imgColor.a;
}
`

class UVPipeline extends Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline {

  texture:string;
  glTexture!:WebGLTexture;
  defaultTexture!:WebGLTexture;
  uvWidth:number = 15.0;
  uvHeight:number = 15.0;

  constructor(game:Phaser.Game, texture:string) {

    super({
      game,
      fragShader
    });

    this.texture = texture;
    this.changeDefaultUVTexture(this.texture);
  }

  changeDefaultUVTexture(texture:string) {
    const phaserTexture = this.game.textures.getFrame(texture);

    if (phaserTexture) {
      this.defaultTexture = phaserTexture.glTexture;
    }
  }

  // bindAndDraw(source: Phaser.Renderer.WebGL.RenderTarget) {
  //   var gl = this.gl;
  //   var renderer = this.renderer;

  //   this.set1i('uMainSampler', 0);
  //   this.set1i('uSecondarySampler', 1);

  //   renderer.popFramebuffer(false, false, false);

  //   if (!renderer.currentFramebuffer)
  //   {
  //     gl.viewport(0, 0, renderer.width, renderer.height);
  //   }

  //   gl.activeTexture(gl.TEXTURE0);
  //   gl.bindTexture(gl.TEXTURE_2D, source.texture);

  //   gl.activeTexture(gl.TEXTURE1)
  //   gl.bindTexture(gl.TEXTURE_2D, this.glTexture);

  //   // @ts-ignore
  //   var matrix = this._tempMatrix1.loadIdentity();

  //   // @ts-ignore
  //   var x = this.targetBounds.x;
  //   // @ts-ignore
  //   var y = this.targetBounds.y;

  //   var xw = x + source.width;
  //   var yh = y + source.height;

  //   var x0 = matrix.getX(x, y);
  //   var x1 = matrix.getX(x, yh);
  //   var x2 = matrix.getX(xw, yh);
  //   var x3 = matrix.getX(xw, y);

  //   //  Regular verts
  //   var y0 = matrix.getY(x, y);
  //   var y1 = matrix.getY(x, yh);
  //   var y2 = matrix.getY(xw, yh);
  //   var y3 = matrix.getY(xw, y);

  //   //  Flip verts:
  //   // var y0 = matrix.getY(x, yh);
  //   // var y1 = matrix.getY(x, y);
  //   // var y2 = matrix.getY(xw, y);
  //   // var y3 = matrix.getY(xw, yh);

  //   this.batchVert(x0, y0, 0, 0, 0, 0, 0xffffff);
  //   this.batchVert(x1, y1, 0, 1, 0, 0, 0xffffff);
  //   this.batchVert(x2, y2, 1, 1, 0, 0, 0xffffff);
  //   this.batchVert(x0, y0, 0, 0, 0, 0, 0xffffff);
  //   this.batchVert(x2, y2, 1, 1, 0, 0, 0xffffff);
  //   this.batchVert(x3, y3, 1, 0, 0, 0, 0xffffff);

  //   this.flush();

  //   renderer.resetTextures();

  //   // No hanging references
  //   // @ts-ignore
  //   this.tempSprite = null;
  // }

  onDrawSprite(gameObject: Phaser.GameObjects.Sprite, target: Phaser.Renderer.WebGL.RenderTarget): void {
    // @ts-ignore
    this.glTexture = gameObject.lookupTexture || this.defaultTexture;
    // // @ts-ignore
    // this.uvWidth = gameObject.uvWidth || 15;
    // // @ts-ignore
    // this.uvHeight = gameObject.uvHeight || this.uvWidth;

    this.set1i('uSecondarySampler', 1);
  }
}

export default UVPipeline