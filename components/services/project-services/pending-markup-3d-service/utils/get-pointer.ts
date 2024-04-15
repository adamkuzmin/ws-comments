/**
 * Converts a mouse event to a THREE.Vector3 object representing a pointer in normalized device coordinates (NDC).
 * @param event - The mouse event.
 * @param _domElement - The DOM element of the viewer's canvas.
 * @returns A THREE.Vector3 object in NDC.
 */
export function getPointer(event: any, _domElement: any) {
  const THREE = (window as any).THREE;

  const rect = _domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  return new THREE.Vector3(x, y, -1);
}
