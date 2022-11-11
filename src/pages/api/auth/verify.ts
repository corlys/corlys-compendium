import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdminApp } from "@/config/firebase-config";
import { SiweMessage } from "siwe";

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

    
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(400).json({ error: "something's wrong" });
  }
}

export default handler;
