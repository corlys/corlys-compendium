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
} from "firebase/firestore";

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

    const q = query(
      collection(firebaseFirestore, "posts"),
      orderBy("created_at", 'desc')
    );
    const querySnapshot = await getDocs(q);
    const result: IPost[] = [];
    const fsIterator: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      fsIterator.push(doc);
    });
    for (const doc of fsIterator) {
      const data = doc.data() as FirestorePostResp;
      const author = await getDoc(data.author);
      if (author.exists()) {
        result.push({ ...data, author: author.id });
      }
    }
    return res.status(200).json({ result });
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
