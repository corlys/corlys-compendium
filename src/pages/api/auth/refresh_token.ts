import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getAuth } from "firebase/auth";

import { ironOptions } from "@/config/cookie-config";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET")
      return res.status(400).json({ error: "wrong_method" });

    if (!req.session.customToken || !req.session.siwe)
      return res.status(400).json({ error: "not logged in" });

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return res.status(401).json({ error: "auth error" });
    const tokenResult = await user.getIdTokenResult();

    req.session.jwtToken = tokenResult;
    req.session.expireDate = new Date(tokenResult.expirationTime).getTime();
    await req.session.save();

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "something's wrong", message: error });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
