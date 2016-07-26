export default {
  PLANET_SIZE_SCALE: 1,
  WEBGL_SCALE: 1000000,
  SCENE_SETTINGS: {
    renderer: {
      physicallyBasedShading: true,
      autoClear: false,//allow render overlay on top of skybox
      shadowMapEnabled: true
    },
    controls: {
      minDistance: 0,
      maxDistance: 500
    },
    camera: {
      position: {
        x: 0,
        y: 0,
        z: 500
      }
    }
  }
}