import type { NextApiRequest, NextApiResponse } from "next";
import Bim360Service from "@/components/bim360/bim360";
import { BIM_ACCOUNT_ID } from "../token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const projects = await Bim360Service.getHubProjects(BIM_ACCOUNT_ID);

      res.status(200).json(projects);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving BIM 360 projects");
    }
  } else {
    // Handle any non-GET requests
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
