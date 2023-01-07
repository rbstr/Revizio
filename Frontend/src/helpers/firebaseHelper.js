import { firestore } from "config/firebase";
import { setDoc, increment, doc, getDoc } from "firebase/firestore";
import moment from "moment";
import "moment/locale/cs";

/**
  * Pomocník pro správu Firebase
  *
  */

const revRef = doc(firestore, "dashboard", 'analytics');
const meetingRef = doc(firestore, "meetingCount", 'analytics');

moment.locale('cs')
export const yymm = moment().format("YYYY/MM");
export const yymmdd = moment().format("YYYY/MM/DD");

// Měsíční vývoj počtu revizí
export const incrementRevisionPerMonth = async (userId) => await setDoc(revRef, { [yymm]: increment(1), [yymm + ":" + userId]: increment(1), [userId]: increment(1), revCount: increment(1) }, { merge: true });
export const decrementRevisionPerMonth = async ({ ryymm, userId }) => await setDoc(revRef, { [ryymm]: increment(-1), [ryymm + ":" + userId]: increment(-1), [userId]: increment(-1), revCount: increment(-1) }, { merge: true });
export const getRevisionPerMonth = async () => (await getDoc(revRef)).data();

// Počet schůzek pro den
export const incrementMeetingPerMonth = async (userId) => await setDoc(meetingRef, { [yymmdd]: increment(1), [yymmdd + ":" + userId]: increment(1), [userId]: increment(1), revCount: increment(1) }, { merge: true });
export const decrementMeetingPerMonth = async ({ ryymmdd, userId }) => await setDoc(meetingRef, { [ryymmdd]: increment(-1), [ryymmdd + ":" + userId]: increment(-1), [userId]: increment(-1), revCount: increment(-1) }, { merge: true });
export const getMeetingPerMonth = async () => (await getDoc(meetingRef)).data();
