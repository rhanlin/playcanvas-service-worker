import * as pc from 'playcanvas'

async function initPlaycanvas(canvas) {
  const gfxOptions = {
    deviceTypes: ['webgl2'],
  };
  
  const device = await pc.createGraphicsDevice(canvas, gfxOptions);
  const createOptions = new pc.AppOptions();
  createOptions.graphicsDevice = device;
  
  createOptions.componentSystems = [
    pc.RenderComponentSystem,
    pc.CameraComponentSystem,
    pc.LightComponentSystem,
    pc.CollisionComponentSystem,
    pc.RigidBodyComponentSystem,
  ];
  createOptions.resourceHandlers = [
    pc.ContainerHandler,
    pc.TextureHandler,
    pc.CubemapHandler,
    pc.BinaryHandler,
    pc.MaterialHandler,
  ];
  
  const app = new pc.AppBase(canvas);
  app.init(createOptions);
  app.start();

  // Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);

  // Ensure canvas is resized when window changes size
  const resize = () => app.resizeCanvas();
  window.addEventListener('resize', resize);
  app.on('destroy', () => {
    window.removeEventListener('resize', resize);
  });
  return { app }
}

export { initPlaycanvas } 