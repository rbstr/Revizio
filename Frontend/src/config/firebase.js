import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { enableIndexedDbPersistence } from "firebase/firestore"


/**
  * Nastavení Firebase účtu
  *
  */


const firebaseConfig = {
  apiKey: "//",
  authDomain: "//",
  projectId: "//",
  storageBucket: "//",
  messagingSenderId: "//",
  appId: "//",
  measurementId: "//"
};

const app = initializeApp(firebaseConfig);


const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const messaging = getMessaging(app);


enableIndexedDbPersistence(firestore)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
      } else if (err.code == 'unimplemented') {
      }
  });

export { firestore, auth, storage, messaging };
export default app;