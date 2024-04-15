// pages/api/get-thumbnail/[urn].js
import type { NextApiRequest, NextApiResponse } from "next";
import Bim360Service from "@/components/bim360/bim360";

export default async function getThumbnail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Extract URN from the query parameters
      const { urn } = req.query;

      if (!urn || typeof urn !== "string") {
        return res.status(400).send("URN is required");
      }

      const thumbnail = await Bim360Service.getThumbnail(urn);

      // Assuming the service returns an image buffer and the image is a PNG.
      // Adjust the 'Content-Type' if the image format is different.
      res.setHeader("Content-Type", "image/png");
      res.send(thumbnail);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving thumbnail");
    }
  } else {
    // Handle any non-GET requests
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
