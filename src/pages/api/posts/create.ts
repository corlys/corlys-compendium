import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import {
  setDoc,
  doc,
  serverTimestamp,
  FirestoreError,
} from "firebase/firestore";

import { ironOptions } from "@/config/cookie-config";
import { stringToSlug } from "@/helpers/index";
import { firebaseFirestore } from "@/config/firebase-config";

type createReqBody = {
  title: string;
  content: string;
  author: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res.status(400).json({
        error: "wrong method",
      });

    const { content, title, author }: createReqBody = req.body;
    if (!content || !title || !author)
      return res.status(400).json({
        error: "wrong input",
      });

    await setDoc(
      doc(firebaseFirestore, "posts", stringToSlug(title) + "-" + author),
      {
        title,
        content,
        spoiler: content.length >= 20 ? `${content.slice(0, 41)}...` : content,
        author: doc(firebaseFirestore, "users/" + author),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }
    );

    return res.status(200).json({
      message: "ok",
    });
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      if (error.code === "unauthenticated")
        return res.status(401).json({
          message: error.message,
        });

      if (error.code === "permission-denied")
        return res.status(403).json({
          message: error.message,
        });
    }

    if (error?.code === "auth/argument-error") {
      return res.status(400).json({
        error: "decode jwt error",
      });
    }

    return res.status(500).json({
      error: "something's wrong",
      message: error?.message,
    });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
