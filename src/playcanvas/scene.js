import * as pc from 'playcanvas'

function parseEntity(e) {
  const entity = new pc.Entity(e.name);

  if (e.pos) {
      entity.setLocalPosition(e.pos[0], e.pos[1], e.pos[2]);
  }
  if (e.rot) {
      entity.setLocalEulerAngles(e.rot[0], e.rot[1], e.rot[2]);
  }
  if (e.scl) {
      entity.setLocalScale(e.scl[0], e.scl[1], e.scl[2]);
  }

  if (e.components) {
      e.components.forEach(function (c) {
          entity.addComponent(c.type, c.options);
      });
  }

  if (e.children) {
      e.children.forEach(function (/** @type {typeof scene} */ child) {
          entity.addChild(parseEntity(child));
      });
  }

  return entity;
}

// Parse the scene data above into entities and add them to the scene's root entity
function parseScene(s, app) {
  s.forEach(function (e) {
      app.root.addChild(parseEntity(e));
  });
}

export { 
  parseScene
}