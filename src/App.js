import './App.css'
import scene from './assets/scene.json'
import { initPlaycanvas } from './playcanvas/app'
import { parseScene } from './playcanvas/scene'
import { execute } from './playcanvas/execute'

function start() {
  const canvas = document.getElementById('application-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('No canvas found');
  }
  initPlaycanvas(canvas).then(({ app }) => {
    parseScene(scene, app);
    execute(app)
  })
}


document.addEventListener('DOMContentLoaded', start);
