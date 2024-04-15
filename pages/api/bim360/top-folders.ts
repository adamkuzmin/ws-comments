import type { NextApiRequest, NextApiResponse } from "next";
import Bim360Service from "@/components/bim360/bim360";
import { BIM_ACCOUNT_ID } from "../token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { projectId } = req.body;

      const topFolders = await Bim360Service.getTopFolders(projectId);

      res.status(200).json(topFolders);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving BIM 360 projects");
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
