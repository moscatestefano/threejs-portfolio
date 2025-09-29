import Cube from './Cube.js'

export default function CubePyramid({ pyramidKey, positionsRef, totalCubes, cubePhysicalApi, score })
{
  const levels = score === undefined ? 4 : 4 + Math.floor(score / 5)
  const cubes = []

  let cubeIndex = 0;
  for (let level = 0; level < levels; level++) {
    const cubesInLevel = levels - level;
    const y = level * 1.1
    for (let i = 0; i < cubesInLevel; i++) {
      const x = (i - (cubesInLevel - 1) / 2) * 1.1
      const z = 5

      cubes.push(
        <Cube
          key={`${level}-${i}`}
          position={[x, y, z]}
          cubePositionsRef={positionsRef}
          index={cubeIndex++}
          cubePhysicalApi={cubePhysicalApi}
        />
      )
    }
  }

  return <>{cubes}</>
}