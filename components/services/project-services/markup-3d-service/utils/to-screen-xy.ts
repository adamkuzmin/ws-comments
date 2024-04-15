export function toScreenXY(
  position: { x: number; y: number; z: number },
  camera: any,
  viewerCanvas: any
): {
  x: number;
  y: number;
} {
  const THREE = (window as any).THREE;

  const widthHalf = 0.5 * viewerCanvas.clientWidth;
  const heightHalf = 0.5 * viewerCanvas.clientHeight;

  const worldPoint = new THREE.Vector3(position.x, position.y, position.z);

  const point = worldPoint.clone().project(camera);

  const x = Math.round(point.x * widthHalf + widthHalf);
  const y = Math.round(-point.y * heightHalf + heightHalf);

  return { x, y };
}
