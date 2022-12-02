import { NextApiRequest, NextApiResponse } from "next";
import { firebaseFirestore, firebaseAdminApp } from "@/config/firebase-config";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/config/cookie-config";
import {
  collection,
  getDocs,
  DocumentData,
  DocumentReference,
  getDoc,
  orderBy,
  query,
  doc,
} from "firebase/firestore";
import lodash from "lodash";

interface IPost {
  content: string;
  title: string;
  author: string;
}

interface FirestorePostResp {
  content: string;
  title: string;
  author: DocumentReference<DocumentData>;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.session.jwtToken?.token;

    const decodedIdToken = await firebaseAdminApp
      .auth()
      .verifyIdToken(token || "");

    if (decodedIdToken.uid !== req.session.siwe?.address)
      return res.status(400).json({
        error: "not logged in",
      });

    const { slug } = req.query;
    if (!slug)
      return res.status(400).json({
        error: "input wrong",
      });

    const stringifySlug = lodash.isArray(slug) ? slug[0] || "" : slug;

    const docRef = doc(firebaseFirestore, "posts", stringifySlug);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as FirestorePostResp;

      const author = await getDoc(data.author);
      if (author.exists()) {
        const result: IPost = {
          ...data,
          author: author.id,
        };
        return res.status(200).json({ result });
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return res.status(400).json({
        error: "no document found",
      });
    }
  } catch (error: any) {
    if (error?.code === "auth/argument-error") {
      return res.status(400).json({
        error: "decode jwt error",
      });
    }
    return res.status(400).json({
      error: "something's wrong",
      message: error,
    });
  }
}

export default withIronSessionApiRoute(handler, ironOptions);
