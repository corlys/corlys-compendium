import { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "@/config/cookie-config";
import { withIronSessionApiRoute } from "iron-session/next";
import { firebaseFirestore } from "@/config/firebase-config";
import { setDoc, doc } from "firebase/firestore";
import { stringToSlug } from "@/helpers/index";

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
        author: doc(firebaseFirestore, "users/" + author),
      }
    );

    return res.status(200).json({
      message: "ok",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "something's wrong",
    });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
