import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import "./App.css"
import Sketch from "./Sketch"
import { EffectComposer, Noise } from "@react-three/postprocessing"

const App = () => (
  <div className='App'>
    <Canvas camera={{ position: [0, 0, -0.5] }}>
      <OrbitControls />
      <Sketch />
      <EffectComposer>
        <Noise opacity={0.15} />
      </EffectComposer>
    </Canvas>
  </div>
)

export default App
