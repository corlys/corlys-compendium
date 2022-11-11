// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import * as admin from "firebase-admin";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
};

// Initialize Firebase
export const firebaseApp =
  getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(firebaseApp)
export const firebaseFirestore = getFirestore(firebaseApp);

// admin firebase
export const firebaseAdminApp =
  admin.apps.length === 0
    ? admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail:
            "firebase-adminsdk-pg3zu@next-blog-7c95b.iam.gserviceaccount.com",
          projectId: process.env.FIREBASE_PROJECT_ID || "",
          privateKey: process.env.SERVICE_ACCOUNT_PRIV_KEY
            ? process.env.SERVICE_ACCOUNT_PRIV_KEY.replace(/\\n/g, "\n")
            : "",
        }),
      })
    : admin.app();

// export const firebaseAdminApp = initializeApp({
//   credential: credential.cert({
//     clientEmail: "custom-token@custom-token-368220.iam.gserviceaccount.com",
//     projectId: "custom-token-368220",
//     privateKey: process.env.SERVICE_ACCOUNT_PRIV_KEY
//       ? process.env.SERVICE_ACCOUNT_PRIV_KEY.replace(/\\n/g, "\n")
//       : "",
//   }),
// });
