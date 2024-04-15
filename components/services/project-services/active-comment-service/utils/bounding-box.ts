import { Rectangle } from "paper";

function getAnnotationBoundingBox(lines: any) {
  //@ts-ignore
  let boundingBox = new Rectangle();

  lines.forEach((line: any) => {
    const lineBounds = line.bounds;

    if (boundingBox.isEmpty()) {
      // Initialize the bounding box with the bounds of the first line
      boundingBox = lineBounds.clone();
    } else {
      // Update the encompassing bounding box to include the current line
      boundingBox = boundingBox.unite(lineBounds);
    }
  });

  return boundingBox;
}

export { getAnnotationBoundingBox };
