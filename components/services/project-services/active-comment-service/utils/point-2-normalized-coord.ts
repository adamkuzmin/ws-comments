import * as paper from "paper";

export function transformPointToNormalizedCoords(point: any, canvas: any) {
  const rect = canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const normalizedX = (point.x - centerX) / centerX; // Maps to [-1, 1]
  const normalizedY = -(point.y - centerY) / centerY; // Maps to [-1, 1], Y is inverted

  // Adjust for aspect ratio if width is wider than height
  const aspectRatio = rect.width / rect.height;

  return { x: normalizedX * aspectRatio, y: normalizedY };
}

// Helper function to convert normalized coordinates back to canvas pixel coordinates
export function deparseNormalizedCoords(normalizedPoint: any, canvas: any) {
  const rect = canvas.getBoundingClientRect();

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const aspectRatio = rect.width / rect.height;

  // Adjust coordinates based on aspect ratio
  const x = (normalizedPoint.x / aspectRatio) * centerX + centerX;
  const y = -(normalizedPoint.y * centerY) + centerY;

  return new paper.Point(x, y);
}
