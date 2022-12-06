import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdminApp, firebaseAuth } from "@/config/firebase-config";
import { signInWithCustomToken } from "firebase/auth";
import { withIronSessionApiRoute } from "iron-session/next";
import { SiweMessage } from "siwe";
import { ironOptions } from "@/config/cookie-config";

interface IVerifyBody {
  message: SiweMessage;
  signature: string;
  accountAddress: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") res.status(400).json({ error: "wrong_method" });
    const { accountAddress, message, signature }: IVerifyBody = req.body;

    if (!message || !signature || !accountAddress)
      res.status(400).json({ error: "wrong input" });

    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.validate(signature);

    // Get the nonce for this address
    const userDocRef = firebaseAdminApp
      .firestore()
      .collection("users")
      .doc(fields.address);
    const userDoc = await userDocRef.get();

    if (fields.nonce !== req.session.nonce || accountAddress !== fields.address)
      res.status(400).json({ error: "wrong nonce" });

    const firebasetoken = await firebaseAdminApp
      .auth()
      .createCustomToken(fields.address);

    const { user } = await signInWithCustomToken(firebaseAuth, firebasetoken);
    const tokenResult = await user.getIdTokenResult();
    req.session.jwtToken = tokenResult;
    req.session.customToken = firebasetoken;
    req.session.expireDate = new Date(tokenResult.expirationTime).getTime(); //new Date().getTime() + 30 * 60000; //add 30 minutes
    req.session.siwe = fields;
    await req.session.save();

    // console.log(req.session);

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "something's wrong", message: error });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
