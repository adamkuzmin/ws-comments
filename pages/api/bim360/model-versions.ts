import type { NextApiRequest, NextApiResponse } from "next";
import Bim360Service from "@/components/bim360/bim360";

export default async function getModelVersions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Extract projectId and folderId from the request body
      const { href } = req.body;

      if (!href) {
        return res.status(400).send("Href is required");
      }

      // Call the listFolderContent function
      const versions = await Bim360Service.getModelVersions(href);

      // Return the folder content
      res.status(200).json(versions);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving model versions");
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
