import * as pc from 'playcanvas'
import URL_BALL from '../assets/ball.glb?url';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function renderToCanvas(entity, app) {
  const isNegative = getRandomInt(1, 10) % 2 ? -1 : 1;
  const position = new pc.Vec3(
    Math.random() * 2 * isNegative,
    Math.random() * 2,
    Math.random() * 2 * isNegative
  );
  let scale = 0.5 + Math.random();
  entity.setLocalPosition(position);
  entity.setLocalScale(new pc.Vec3(scale, scale, scale));
  entity.rotateLocal(90, 0, 0);
  app.root.addChild(entity);
}

function createAsset(index, app) {
  return new Promise((resolve) => {
    const asset = new pc.Asset(`IMAGE_${index}`, 'texture', {
      url: `https://picsum.photos/3000?$random=${index}`,
    });
    asset.preload = true;

    const entity = new pc.Entity();
    const material = new pc.StandardMaterial();
    material.useLighting = false;
    material.blendType = pc.BLEND_PREMULTIPLIED;
    entity.addComponent('render', {
      type: 'plane',
      material,
      castShadows: false,
    });
    resolve({ entity, asset });

    const loader = new pc.AssetListLoader([asset], app.assets);
    loader.load(() => {
      console.log(`assets: ${asset.name} loaded`);
      const texture = asset.resource;
      material.emissiveMap = texture;
      material.update();
    });
  });
}

function destroyAsset(asset, app) {
  if (asset instanceof pc.Asset) {
    if (asset.resource && asset.resource.destroy) {
      const sameResourceAssets = asset.registry.filter(
        (otherAsset) => otherAsset.resource === asset.resource
      );

      if (sameResourceAssets.length === 1) {
        asset.registry._loader.clearCache(asset.file.url, asset.type);
        asset.resource.destroy();
      }
    }

    app.assets.remove(asset);
  }
}

function execute(app) {
  const entities = [];
  const convertedAssets = [];
  const max = 200
  const delay = 0.5
  let adding = true;
  let loading = false;
  let index = 0;
  let timer = 0;
  app.on('update', function (dt) {
    timer += dt;
    if (timer >= delay && adding && !loading) {
      index++;
      timer = 0;
      loading = true;

      createAsset(index, app)
        .then(({ entity, asset }) => {
          loading = false;
  
          entity.tags.add('entity-object');
  
          entities.push(entity);
          convertedAssets.push(asset);
          renderToCanvas(entity, app);
  
          if (entities.length >= max) {
            adding = false;
            // window.alert('Finish');
          }
        })
        .catch((error) => {
          loading = false;
          console.error(error);
        });
    }
  
    // if (!adding && entities.length > 0) {
    //   const asset = convertedAssets[convertedAssets.length - 1];
    //   destroyAsset(asset, app);
    //   convertedAssets.length--;
  
    //   const entity = entities[entities.length - 1];
    //   entity.destroy();
    //   entities.length--;
    // }
  });
  
  
}

export { execute }