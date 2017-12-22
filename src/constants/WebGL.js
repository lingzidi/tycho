export const SPECULAR_COLOR = 0x000000;

export const MESH_DEFAULT_COLOR = 0xFFFFFF;

export const SPHERE_SEGMENTS = 32;

export const PLANET_SIZE_SCALE = 1;

export const UNIT_SCALE = 1000000;

export const Ellipse = {
  POINTS: 512,
  START: -Math.PI / 2,
  END: 3 * Math.PI / 2
};

export const Tween = {
  FAST: 1000,
  NORMAL: 2000,
  SLOW: 5000
};

export const Zoom = {
  MIN: 0.0005,
  MAX: 100,
  STEP: 0.005
};

export const Camera = {
  NEAR: 0.001,
  FAR: 15000,
  FOV: 50,
  X: 12000,
  Y: 12000,
  Z: 12000,
  MAX_DISTANCE: 12000,
  MIN_DISTANCE: 0.001,
  SATELLITE_LABEL_RANGE: 7
};

export const ScrollScale = [
  {
    distance: 0.2,
    scale: 0.005
  },
  {
    distance: 0.1,
    scale: 0.05
  },
  {
    distance: 0.05,
    scale: 0.1
  }
];

export const SKYBOX_TEXTURES = [
  '/static/textures/map/skybox/s_px.jpg',
  '/static/textures/map/skybox/s_nx.jpg',
  '/static/textures/map/skybox/s_py.jpg',
  '/static/textures/map/skybox/s_ny.jpg',
  '/static/textures/map/skybox/s_pz.jpg',
  '/static/textures/map/skybox/s_nz.jpg'
];