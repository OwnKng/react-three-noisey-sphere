// @ts-ignore
import glsl from "babel-plugin-glsl/macro"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { ShaderMaterial } from "three"
import { useFrame } from "@react-three/fiber"

const vertex = glsl`
    varying vec3 vPosition; 
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0); 
        vPosition = position; 
    }
`

const fragment = glsl`
    uniform float uTime; 

    varying vec3 vPosition;

    #pragma glslify: noise = require('glsl-noise/simplex/3d')
    #pragma glslify: rotate = require(glsl-rotate) 


    float line(vec2 coordinates, float offset) {
        float wave = abs(0.5 * (sin(coordinates.x * 10.0) + offset * 2.0)); 
        return smoothstep(0.0, 0.5 + offset * 0.5, wave); 
    }

    void main() {

        //* coordinates
        vec3 noiseCoords = vec3(vPosition + uTime * 0.25); 
        float distortion = noise(noiseCoords); 
        
        vec2 _uv = rotate(vPosition.xy * 0.5, distortion) * 0.1; 

        //* create pattern
        float firstLines = line(_uv, 0.5); 
        float secondLines = line(_uv, 0.1);

        //* create colors
        vec3 colorOne = vec3(4. / 255., 150. / 255., 255. / 255.);
        vec3 colorTwo = vec3(3. / 255., 78. / 255., 133. / 255.);
        vec3 colorThree = vec3(255.0 / 255.0, 93.0 / 255.0, 113.0 / 255.0);
        
        vec3 colorMixOne = mix(colorTwo, colorOne, firstLines); 
        vec3 colorMixTwo = mix(colorMixOne, colorThree, secondLines); 
        

        gl_FragColor = vec4(colorMixTwo, 1.0); 
    }
`

const Background = () => {
  const ref = useRef<ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
    }),
    []
  )

  useFrame(
    ({ clock }) => (ref.current.uniforms.uTime.value = clock.getElapsedTime())
  )

  return (
    <mesh>
      <sphereBufferGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vertex}
        fragmentShader={fragment}
        side={THREE.DoubleSide}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default Background
