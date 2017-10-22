import * as THREE from 'three';
import domEvents from 'threex-domevents';

/**
 * Creates THREEx DOM events on the active canvas DOM element.
 * See: https://github.com/jeromeetienne/threex.domevents
 * 
 * @param {THREE.Camera} camera - active camera
 * @returns {THREEx.DomEvents} DOMEvents method
 */
export default function createDomEvents(camera) {
    const renderer = document.querySelector('canvas');
    const THREEx = {};

    domEvents(THREE, THREEx);

    return new THREEx.DomEvents(camera, renderer);
}