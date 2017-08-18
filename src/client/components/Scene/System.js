import Scene from './Scene';
import Fixtures from 'global/fixtures';
import Orbital from './Objects/Orbital';
import Clock from 'engine/clock';

export default class System {

  constructor(data) {
    this.data = Fixtures;//data;//temp
    this.clock = new Clock();
    this.setUp();
    this.animate();
  }

  /**
   * Setup.
   */
  setUp = () => {
    this.renderSkybox();
    this.renderScene();
    this.renderOrbitals();
    this.renderSun();
  }

  /**
   * Renders the skybox (Milky Way)
   */
  renderSkybox = () => {
    // TODO
  }

  /**
   * Renders the Sun.
   */
  renderSun = () => {
    // TODO
  }

  /**
   * Renders the scene.
   */
  renderScene = () => {
    this.scene = new Scene(this.clock);
  }

  /**
   * Renders the orbitals from the data.
   */
  renderOrbitals = () => {
    this.orbitals = this.data.map(this.addOrbital);
  }

  /**
   * Animation loop.
   */
  animate = () => {
    this.scene.animate();
    this.orbitals.forEach(this.updateOrbital);
    this.clock.update();
    requestAnimationFrame(this.animate);
  }

  /**
   * Updates the positions of an orbital.
   * @param  {Orbital} orbital
   */
  updateOrbital = (orbital) => {
    orbital.updatePosition(this.clock.elapsedTime);
  }

  /**
   * Adds an orbital to the scene. The orbital's angle of
   * inclination is raised to the ecliptic plane.
   * @param  {Object} orbital - data of orbital to add
   * @return {Orbital} instance of orbital added
   */
  addOrbital = (orbital) => {
    orbital.inclination -= 90;
    return new Orbital(orbital, this.scene);
  }

  /**
   * Events to execute on each clock second ("tick")
   * @param  {Function} fn function to execute
   */
  tick = (fn) => {
    this.clock.tick(fn);
  }

  /**
   * Zooms to specified level
   * @param  {Number} level zoom percentage [0,1]
   */
  zoom = (level) => {
    this.scene.controls.zoom(level);
  }

  /**
   * Change the proportion (scale) of the props in scene
   * @param  {Number} proportion scalar to multiply sizes by,
   *                             as an exponent of 10
   */
  size = (scale) => {
    // Math.pow(10, scale);
  }

  /**
   * Change the scale of the props in scene
   * @param  {Number} speed scalar to multiply time elapsed by,
   *                        as an exponent of 10
   */
  speed = (speed) => {
    this.clock.speed(speed);
  }
}
