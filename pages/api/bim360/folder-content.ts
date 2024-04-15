import type { NextApiRequest, NextApiResponse } from "next";
import Bim360Service from "@/components/bim360/bim360";

export default async function listFolderContentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Extract projectId and folderId from the request body
      const { projectId, folderId } = req.body;

      // Check if projectId and folderId are provided
      if (!projectId || !folderId) {
        return res.status(400).send("Project ID and Folder ID are required");
      }

      // Call the listFolderContent function
      const folderContent = await Bim360Service.listFolderContent(
        projectId,
        folderId
      );

      // Return the folder content
      res.status(200).json(folderContent);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving folder contents");
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
