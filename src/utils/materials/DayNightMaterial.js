import * as THREE from 'three';

/**
 * @module Day/Night Texture Rendering Shader
 *
 * @copyright Sean O'Neil
 * @copyright James Baicoianu
 */

/**
 * Returns the shader material for day/night transition textures.
 *
 * @param {String} mapDay - url of day map
 * @param {String} mapNight - url of night map
 * @returns {Object} config object for shader material
 */
export default function DayNightMaterial(mapDay, mapNight) {
  const textureLoader = new THREE.TextureLoader();

  const uniforms = {
    sunDirection: {value: new THREE.Vector3(0,1,0) },
    dayTexture: { value: textureLoader.load(mapDay) },
    nightTexture: { value: textureLoader.load(mapNight) }
  };

  return {
    uniforms,
    vertexShader,
    fragmentShader,
    vertexColors: THREE.FaceColors
  };
}

/**
 * Day/Night texture map vertex shader
 *
 * @author Sean O'Neil
 * @copyright 2004 Sean O'Neil
 */
const vertexShader = `
	varying vec2 vUv;
	varying vec3 vNormal;
	precision mediump float; 
	varying vec4 forFragColor;

	void main() {
		vUv = uv;
		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		vNormal = normalMatrix * normal;
		gl_Position = projectionMatrix * mvPosition;
	}
`;

/**
 * Day/Night texture map fragmentShader shader
 *
 * @author Sean O'Neil
 * @copyright 2004 Sean O'Neil
 */
const fragmentShader = `
	uniform sampler2D dayTexture;
	uniform sampler2D nightTexture;
	uniform sampler2D specularTexture;
	uniform vec3 sunDirection;
	uniform vec3 specularDirection;
	varying vec3 vNormal;
	varying vec2 vUv;
	void main() {
		// Textures for day and night:
		vec3 dayColor       = texture2D( dayTexture, vUv ).xyz;
		vec3 nightColor     = texture2D( nightTexture, vUv ).xyz;

		// compute cosine sun to normal so -1 is away from sun and +1 is toward sun.
		float cosineAngleSunToNormal = dot(normalize(vNormal), sunDirection);

		// sharpen the edge beween the transition
		cosineAngleSunToNormal = clamp( cosineAngleSunToNormal * 3.0, -1.0, 1.0);

		// convert to 0 to 1 for mixing
		float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;

		// Atmosphere:
		float intensity = 1.0 - dot( vNormal, vec3( 0.0,0.0, 1.0 ) );
		vec3 atmosphere = vec3( 1,1,1) * pow( intensity, 1.0 );

		// Specular:
		vec3 specularAmount = texture2D( specularTexture, vUv ).xyz;
		vec3 specularColor  = vec3(1,1,1);

		// Play with these parameters to adjust the specular:
		float c = 0.035;    // Size, I guess...
		float p = 30.0;     // Blur
		float mixAmountSpecular = pow(c * dot(normalize(vNormal), specularDirection), p) * (specularAmount.z * 0.5);

		// Select day or night texture based on mixAmount.
		vec3 color = mix(dayColor, specularColor, mixAmountSpecular);
		color = mix( nightColor, color + atmosphere, mixAmount );

		// Set the color
		gl_FragColor = vec4(color, 1.0);
	}
`;
