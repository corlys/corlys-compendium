import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { signOut } from "firebase/auth";
import { generateNonce } from "siwe";
import { ironOptions } from "@/config/cookie-config";
import { firebaseAuth, firebaseAdminApp } from "@/config/firebase-config";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res.status(400).json({ error: "wrong_method" });

    const userDoc = await firebaseAdminApp
      .firestore()
      .collection("users")
      .doc(req.session.siwe?.address || "")
      .get();

    if (userDoc.exists) {
      const newNonce = generateNonce();
      // Associate the nonce with that user
      await firebaseAdminApp
        .firestore()
        .collection("users")
        .doc(req.session.siwe?.address || "")
        .set({
          nonce: newNonce,
        });
    }

    await signOut(firebaseAuth);
    req.session.destroy();

    return res.status(200).json({
      message: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "something's wrong", message: error });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
