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
      const generatedNonce = generateNonce();
      req.session.nonce = generatedNonce;
      await req.session.save();
      // Associate the nonce with that user
      await firebaseAdminApp
        .firestore()
        .collection("users")
        .doc(accountAddress)
        .set({
          nonce: generatedNonce,
        });
      return res.status(200).json({ nonce: generatedNonce });
    } else {
      return res.status(400).json({ message: "user is not yet registerd" });
    }
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: "something's wrong", message: error.message });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
