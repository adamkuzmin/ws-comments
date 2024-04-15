import APS from "forge-apis";
import { NextApiRequest, NextApiResponse } from "next";

export const CLIENT_ID = "CDZCpxk2OBTmXKuhyXnUFvRyywe2C5GFrXqmG5aEts1anjkl";
export const CLIENT_SECRET =
  "XWlwODmghb2204eAjukPjNVAbvAYX5TDMzf8B7jKep1AHMKEv1fAdHAtDfGl5Zk9";
export const BIM_ACCOUNT_ID = "b.85cbcc08-494b-463b-84e5-54a5eb5840f0";

const publicAuthClient = new APS.AuthClientTwoLegged(
  CLIENT_ID,
  CLIENT_SECRET,
  ["viewables:read"],
  true
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      if (!publicAuthClient.isAuthorized()) {
        await publicAuthClient.authenticate();
      }

      res.status(200).json(publicAuthClient.getCredentials());
    } catch (error) {
      console.error("Error fetching token:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
