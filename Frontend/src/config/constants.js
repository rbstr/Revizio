import { doc } from "firebase/firestore";
import { firestore } from "./firebase";

export const refs={
    revisionDoc : doc(firestore, "revisions"),
    profileDoc : doc(firestore, "profile"),

}