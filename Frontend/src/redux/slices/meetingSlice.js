import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { firestore } from "config/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, serverTimestamp, where, startAt, endAt } from "firebase/firestore";
import { catchAsync, handleLoading, reduxToolKitCaseBuilder } from "helpers/detectError";
import moment from "moment";
import { getDate } from "pages/Dashboard/Calendar";
import { toast } from "react-toastify";



// create meeting async thunk
export const createMeetingAsyncThunk = createAsyncThunk(
  "meeting/createMeetingAsyncThunk",
  catchAsync(async ({ data, callBack, fetchMeetings }, { getState, dispatch }) => {
    const state = getState();
    const collRef = collection(firestore, "meetings");
    const savedDoc = await setDoc(doc(collRef), {
      timestamp: serverTimestamp(),
      ...data,
      dateFilter: getDate(data.meetingDate).getTime(),
      userId: state.auth.uid,
    }, { merge: true });
    toast.success("Schůzka úspěšně uložena!")
    if (callBack) callBack()
    if (fetchMeetings) dispatch(getMeetingsAsyncThunk({ perPage: 10000, first: true }))
    return savedDoc;
  })
);

// get meeting for id async thunk
export const getMeetingAsyncThunk = createAsyncThunk(
  "meeting/getMeetingAsyncThunk",
  catchAsync(async ({ id }, { getState }) => {
    const docRef = doc(firestore, "meetings", id);
    const profile = await getDoc(docRef);
    if (profile.exists()) {
      return profile.data();
    }
    //console.log('Profile is not updated:', profile)
    throw ("Mám potíže získat schůzky.");
  })
);
// get meetings async thunk
export const getMeetingsForCountAsyncThunk = createAsyncThunk(
  "meeting/getMeetingsForCountAsyncThunk",
  catchAsync(async ({ perPage, first }, { getState }) => {
    const state = getState();
    var q;
    if (state.meeting.meetingsForCount.data.length && !first) {
      q = query(collection(firestore, "meetings"),
        orderBy("dateFilter"),
        where("userId", "==", state.auth.uid),
        startAfter(state.meeting.meetingsForCount.lastItem));
    } else {

      q = query(collection(firestore, "meetings"),
        orderBy("dateFilter"),
        where("userId", "==", state.auth.uid)
      );
    }

    // const q = query(collection(firestore, "profile"), orderBy("firstName"), limit(12));
    const querySnapshot = await getDocs(q);

    // const querySnapshot = await getDocs(collection(firestore, "profile"));
    const data = [];
    querySnapshot.forEach(el => {
      data.push({ ...el.data(), id: el.id })
    })
    //console.log('getMeetingsForCountAsyncThunk:', data)
    return {
      loadMore: data.length === +perPage,
      data,
      first: !!first,
      lastItem: querySnapshot.size > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,

    };
  })
);
// get meetings async thunk
export const getMeetingsAsyncThunk = createAsyncThunk(
  "meeting/getMeetingsAsyncThunk",
  catchAsync(async ({ perPage, search, first }, { getState }) => {
    const state = getState();
    //console.log('state:', state.auth.uid)
    var q;
    if (state.meeting.meetings.data.length && !first) {
      q = query(collection(firestore, "meetings"),
        where("userId", "==", state.auth.uid),
        ...(search ?
          [orderBy("meetingTitle"), orderBy("timestamp"), startAt(search.toLowerCase()),
          endAt(search.toLowerCase() + "\uf8ff")] : [orderBy("timestamp", "desc")]
        ),
        startAfter(state.meeting.meetings.lastItem),
        limit(perPage ?? 10));
    } else {

      q = query(collection(firestore, "meetings"),
        where("userId", "==", state.auth.uid),
        // orderBy("clientId"),
        ...(search ?
          [orderBy("meetingTitle"), orderBy("timestamp"),
          startAt(search.toLowerCase()),
          endAt(search.toLowerCase() + "\uf8ff")

          ] : [orderBy("timestamp", "desc")]
        ),
        limit(perPage ?? 10));
    }

    // const q = query(collection(firestore, "profile"), orderBy("firstName"), limit(12));
    const querySnapshot = await getDocs(q);

    // const querySnapshot = await getDocs(collection(firestore, "profile"));
    //console.log('querySnapshot:', querySnapshot.size)

    const data = [];
    querySnapshot.forEach(async el => { data.push({ ...el.data(), id: el.id }) })
    //console.log('data:', data)
    return {
      loadMore: data.length == +perPage,
      data,
      first: !!first,
      lastItem: querySnapshot.size > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
    };
  })
);

// logout async thunk
export const deleteMeetingAsyncThunk = createAsyncThunk(
  "meeting/deleteMeetingAsyncThunk",
  catchAsync(async ({ id, navigate, fetchList, clientId, callBack }, { dispatch, getState }) => {
    const state = getState();
    const rev = await getDoc(doc(firestore, "meetings", id))
    //console.log("rev:", moment(rev.data().timestamp.seconds * 1000).format('YYYY/MM'))
    if (fetchList) {
      dispatch(getMeetingsAsyncThunk({ perPage: 10, search: "", first: true }));
    }
    if (navigate) navigate('/clients/meetings')
    if (callBack) callBack()
    return true;
  })
);

const initialState = {
  //states
  meeting: {},
  pdfMeetingData: {},
  meetingsForCount: {
    current_page: 1,
    loadMore: true,
    data: [],
  },
  meetings: {
    current_page: 1,
    loadMore: true,
    data: [],
  },
  // meetings: {
  //   page:1,
  //   perPage:5,
  //   rows:[],
  // },
  analytics: {
    revCount: 0,
  },
  meetingForm: {
    initial: {
      clientId: null,
      signImg: null,
      performedTests: {},
      basicInformation: {},
      techInformation: {
      },
      foundDefects: {},
      additionalInformation: {},
      edit: false
    },
    service: {
      clientId: null,
      signImg: null,
      performedTests: {},
      edit: false,
      basicInformation: {},
      techInformation: {},
      foundDefects: {},
      additionalInformation: {},
    }
  },
  // manager states
  errors: {},
  loadings: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    resetMeetingForm(state, action) {
      state.meetingForm = {
        initial: {
          clientId: null,
          signImg: null,
          performedTests: {},

          basicInformation: {},
          techInformation: {
          },
          foundDefects: {},
          additionalInformation: {},
          edit: false
        },
        service: {
          clientId: null,
          signImg: null,
          performedTests: {},
          edit: false,
          basicInformation: {

          },
          techInformation: {},
          foundDefects: {},
          additionalInformation: {},
        }
      }
    },
    setPdfMeetingData(state, action) {
      state.pdfMeetingData = { ...action.payload };
    },
    setBasicInformation(state, action) {
      state.meetingForm[action.payload.type] = {
        ...state.meetingForm[action.payload.type],
        basicInformation: action.payload.data,
      };
    },
    setPerformedTests(state, action) {
      state.meetingForm[action.payload.type] = {
        ...state.meetingForm[action.payload.type],
        performedTests: action.payload.data
      };
    },
    setTechInformation(state, action) {
      state.meetingForm[action.payload.type] = {
        ...state.meetingForm[action.payload.type],
        techInformation: action.payload.data
      };
    },
    setFoundDefects(state, action) {
      state.meetingForm[action.payload.type] = {
        ...state.meetingForm[action.payload.type],
        foundDefects: action.payload.data
      };
    },
    setAdditionalInformation(state, action) {
      state.meetingForm[action.payload.type] = {
        ...state.meetingForm[action.payload.type],
        additionalInformation: action.payload.data,
        signImg: action.payload.signImg
      };
    },
    setMeetingData(state, action) {
      state.meetingForm[action.payload.type] = { ...action.payload };
    },
    setEditMeeting(state, action) {
      state.meetingForm[action.payload.type] = {
        ...state.meetingForm[action.payload.type],
        additionalInformation: action.payload.data,
        signImg: action.payload.signImg,
        edit: true
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMeetingAsyncThunk.fulfilled, (state, action) => {
        state.user = {};
      })
      .addCase(getMeetingAsyncThunk.fulfilled, (state, action) => {
        state.meeting = action.payload;
      })
      .addCase(getMeetingsAsyncThunk.fulfilled, (state, action) => {
        state.meetings = {
          ...action.payload,
          data: action.payload.first ? action.payload.data : [...state.meetings.data, ...action.payload.data],
          current_page: state.meetings.data.length ? state.meetings.current_page++ : 1
        };
      })
      .addCase(getMeetingsForCountAsyncThunk.fulfilled, (state, action) => {
        state.meetingsForCount = {
          ...action.payload,
          data: action.payload.first ? action.payload.data : [...state.meetings.data, ...action.payload.data],
          current_page: state.meetings.data.length ? state.meetings.current_page++ : 1
        };
      })
      // im using addMatcher to manage the asyncthunksMehtod actions like fullfilled,pending,rejected and also to manage the errors loading and error messages and async params
      .addMatcher(
        // isAsyncThunk will run when the action is an asyncthunk exists from giver asycntthunks
        isAnyOf(
          // reduxToolKitCaseBuilder helper make fullfilled, pending, and rejected cases
          ...(reduxToolKitCaseBuilder([
            createMeetingAsyncThunk,
            getMeetingAsyncThunk,
            getMeetingsForCountAsyncThunk,
            getMeetingsAsyncThunk,
            deleteMeetingAsyncThunk,
          ]))
        ),
        handleLoading
      );
  },
});

export default meetingSlice.reducer;
export const { setBasicInformation, setPerformedTests, setTechInformation, setFoundDefects, setAdditionalInformation, setEditMeeting, setMeetingData, setPdfMeetingData, resetMeetingForm } = meetingSlice.actions;
