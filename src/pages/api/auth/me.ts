import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/config/cookie-config";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET")
      return res.status(400).json({ error: "wrong_method" });

    if (!req.session.customToken || !req.session.siwe)
      return res.status(400).json({ error: "not logged in" });

    return res.status(200).json({
      auth: {
        id: req.session.siwe.address,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "something's wrong", message: error });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
