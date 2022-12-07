import { NextApiRequest, NextApiResponse } from "next";
import {
  collection,
  getDocs,
  DocumentData,
  DocumentReference,
  getDoc,
  orderBy,
  FirestoreError,
  query,
  limit,
  startAfter,
  doc,
  DocumentSnapshot,
} from "firebase/firestore";
import { withIronSessionApiRoute } from "iron-session/next";
import lodash from "lodash";

import { firebaseFirestore, firebaseAdminApp } from "@/config/firebase-config";
import { ironOptions } from "@/config/cookie-config";

interface IPost {
  content: string;
  title: string;
  author: string;
  slug: string;
  spoiler?: string;
}

interface FirestorePostResp {
  id: string;
  content: string;
  title: string;
  spoiler?: string;
  author: DocumentReference<DocumentData>;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET")
      return res.status(400).json({
        error: "wrong method",
      });

    const { lastIdParam } = req.query;
    if (!lastIdParam)
      return res.status(400).json({
        error: "input wrong",
      });

    console.log("lastIdParam", typeof lastIdParam, lastIdParam);

    const token = req.session.jwtToken?.token;

    const decodedIdToken = await firebaseAdminApp
      .auth()
      .verifyIdToken(token || "");

    if (decodedIdToken.uid !== req.session.siwe?.address)
      return res.status(400).json({
        error: "not logged in",
      });

    const stringifyLastId = lodash.isArray(lastIdParam)
      ? lastIdParam[0] || ""
      : lastIdParam;

    const lastDocRef = await getDoc(
      doc(firebaseFirestore, "posts", stringifyLastId)
    );

    // const testDocRef = await getDoc(
    //   doc(
    //     firebaseFirestore,
    //     "posts",
    //     "ronge-0xC8a33cc425e04081B83DBcF63de41aeE9254A330"
    //   )
    // );

    const q = query(
      collection(firebaseFirestore, "posts"),
      orderBy("created_at", "desc"),
      limit(5),
      startAfter(lastDocRef.exists() ? lastDocRef : "")
    );

    const querySnapshot = await getDocs(q);
    const posts: IPost[] = [];
    const fsIterator: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      fsIterator.push(doc);
    });
    let lastId: string | null = null;
    for (const doc of fsIterator) {
      const data = doc.data() as FirestorePostResp;
      const author = await getDoc(data.author);
      if (author.exists()) {
        posts.push({ ...data, author: author.id, slug: doc.id });
      }
      lastId = doc.id;
    }
    return res.status(200).json({ posts, lastId });
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      console.log("firestore error");
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
