# phaser3-uv-mapping
Repo for the opensourced uv mapping based on https://www.youtube.com/watch?v=HsOKwUwL1bE

This package only works in webgl mode.

# Installation
current required phaser version is 3.60.0-beta.4 as this package relies on the spritefx pipelines.

## npm
```
npm install -S phaser3-uv-mapping phaser@3.60.0-beta.4
```

# Usage
Just import the file and create the pipeline

```js
import UVPipeline from 'phaser3-uv-mapping'

// .....
create() {
  // create a the uv pipeline
  const pipeline = this.renderer.pipelines.add('UVPipeline', new UVPipeline(this.game, 'default-uv-texture-key'))

  // on any sprite or image you have set it's pipeline to the UVPipeline
  sprite.setPipeline(pipeline)

  // the pipeline will use the lookup texture provided when it's created by default but to override this object by object give it a lookupTexture property
  // for example.

  const phaserTexture = this.game.textures.getFrame('other-uv-texture')

  if (phaserTexture) {
    sprite.lookupTexture = phaserTexture.glTexture;
  }

  // to change the default texture it's just this easy.
  pipeline.changeDefaultUVTexture('new-texture-key')
}
// .....