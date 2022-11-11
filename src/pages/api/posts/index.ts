import { NextApiRequest, NextApiResponse } from "next";
import { signInWithCustomToken } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase-config";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/config/cookie-config";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const customToken = req.session?.customToken;
    if (!customToken) return res.status(400).json({ error: "not logged in" });
    console.log(req.session);
    const { user } = await signInWithCustomToken(firebaseAuth, customToken);

    return res.status(200).json({
      user: user.uid,
    });
  } catch (error) {
    return res.status(400).json({
      error: "something's wrong",
      message: error,
      session: req.session ?? "",
    });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
