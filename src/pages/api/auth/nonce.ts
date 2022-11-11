import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdminApp } from "@/config/firebase-config";
import { ironOptions } from "@/config/cookie-config";
import { withIronSessionApiRoute } from "iron-session/next";
import { generateNonce } from "siwe";

interface INonceRequest {
  accountAddress: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") res.status(400).json({ error: "wrong_method" });
    const { accountAddress }: INonceRequest = req.body;
    if (!accountAddress) res.status(400).json({ error: "wrong_input" });

    const userDoc = await firebaseAdminApp
      .firestore()
      .collection("users")
      .doc(accountAddress)
      .get();

    if (userDoc.exists) {
      // The user document exists already, so just return the nonce
      const existingNonce = userDoc.data()?.nonce;

      req.session.nonce = existingNonce;
      await req.session.save();

      return res.status(200).json({ nonce: existingNonce });
    } else {
      // The user document does not exist, create it first
      const generatedNonce = generateNonce();
      req.session.nonce = generatedNonce;
      await req.session.save();
      // Create an Auth user
      const createdUser = await firebaseAdminApp.auth().createUser({
        uid: accountAddress,
      });
      // Associate the nonce with that user
      await firebaseAdminApp
        .firestore()
        .collection("users")
        .doc(createdUser.uid)
        .set({
          nonce: generatedNonce,
        });
      return res.status(200).json({ nonce: generatedNonce });
    }
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: "something's wrong", message: error.message });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
