import * as Tour from './Tour';
import * as WebGL from './WebGL';
import * as UI from './UI';

export default {
  Tour,
  WebGL,
  UI,
  SCENE_SETTINGS: {
    renderer: {
      // physicallyBasedShading: true,
      // autoClear: false,//allow render overlay on top of skybox
      // shadowMapEnabled: true,
    },
  }
}
