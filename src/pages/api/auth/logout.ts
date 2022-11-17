import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/config/cookie-config";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase-config";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res.status(400).json({ error: "wrong_method" });
    await signOut(firebaseAuth);
    req.session.destroy();
    console.log(req.session)
    return res.status(200).json({
      message: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "something's wrong", message: error });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
