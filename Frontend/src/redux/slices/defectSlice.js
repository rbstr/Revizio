import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { firestore, storage } from "config/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, serverTimestamp, where, startAt, endAt } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { catchAsync, handleLoading, reduxToolKitCaseBuilder } from "helpers/detectError";
// import { getDefectPerMonth, incrementDefectPerMonth, yymm } from "helpers/firebaseHelper";

// create defect async thunk
export const createDefectAsyncThunk = createAsyncThunk(
  "defect/createDefectAsyncThunk",
  catchAsync(async ({ data, handleToggleModal }, { getState, dispatch }) => {
    const state = getState();
    const collRef = collection(firestore, "defects");
    const savedDoc = await setDoc(doc(collRef), {
      ...data,
      type: state.defect.type ?? "majorDefects",
      timestamp: serverTimestamp(),
      userId: state.auth.uid,
    });
    //console.log('savedDoc:', savedDoc)
    //console.log('savedDoc id:', collRef.id)
    dispatch(getDefectsAsyncThunk())
    handleToggleModal()
    return savedDoc;
  })
);

// get defect for id async thunk
export const getDefectAsyncThunk = createAsyncThunk(
  "defect/getDefectAsyncThunk",
  catchAsync(async ({ id }, { getState }) => {
    const docRef = doc(firestore, "defects", id);
    const profile = await getDoc(docRef);
    if (profile.exists()) {
      //console.log('defect:', profile.data())
      return profile.data();
    }
    //console.log('Profile is not updated:', profile)
    throw ("Mám potíže získat závady.");
  })
);
// get defects async thunk
export const getCommonDefectsAsyncThunk = createAsyncThunk(
  "defect/getCommonDefectsAsyncThunk",
  catchAsync(async ({ deviceName }, { getState }) => {
    const state = getState();
    const { uid } = state.auth;


    var q = query(collection(firestore, "revisions"),where("techInformation.deviceName", "==", deviceName))
    const querySnapshot = await getDocs(q);
    //console.log(querySnapshot.size)
    //console.log(querySnapshot.docs?.[0]?.data())

    const data = [];
    querySnapshot.forEach(el => {
      let item = el.data()
      if (item?.foundDefects.minorDefects) {
        if (Array.isArray(item?.foundDefects.minorDefects)) {

          item?.foundDefects.minorDefects.map(k => {
            if (k != "Bez zjevných závad.")
              data.push(k)
          })
        } else {
          if (item?.foundDefects?.minorDefects != "Bez zjevných závad.")
            data.push(item.foundDefects.minorDefects)
        }
      }
      if (item?.foundDefects.majorDefects) {
        if (Array.isArray(item?.foundDefects.majorDefects)) {
          item?.foundDefects.majorDefects.map(k => {
            if (k != "Bez zjevných závad.")
              data.push(k)
          })
        } else {
          if (item?.foundDefects?.majorDefects != "Bez zjevných závad.")

            data.push(item.foundDefects.majorDefects)
        }
      }
      if (item?.foundDefects.deviceDefects) {
        if (Array.isArray(item?.foundDefects.deviceDefects)) {
          item?.foundDefects.deviceDefects.map(k => {
            if (k != "Bez zjevných závad.")
              data.push(k)
          })
        } else {
          if (item?.foundDefects?.deviceDefects != "Bez zjevných závad.")
            data.push(item.foundDefects.deviceDefects)
        }
      }
    })
    return data.slice(0,3);
  })
);
// get defects async thunk
export const getDefectsAsyncThunk = createAsyncThunk(
  "defect/getDefectsAsyncThunk",
  catchAsync(async (_, { getState }) => {
    const state = getState();
    const { uid } = state.auth;
    var q = query(collection(firestore, "defects"), where("userId", "==", uid), orderBy("timestamp"));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach(el => {
      data.push({ ...el.data(), id: el.id })
    })
    //console.log('data:', data)
    return {
      loadMore: false,
      data,
      first: true,
      lastItem: null,
    };
  })
);

// logout async thunk
export const deleteDefectAsyncThunk = createAsyncThunk(
  "defect/deleteDefectAsyncThunk",
  catchAsync(async ({ id }, _) => {
    await deleteDoc(doc(firestore, "defects", id));
    return true;
  })
);

const initialState = {
  //states
  defect: {},
  type: "",
  defects: {
    current_page: 1,
    loadMore: true,
    data: [],
  },
  commonDefects: [],

  // manager states
  errors: {},
  loadings: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const defectSlice = createSlice({
  name: "defect",
  initialState,
  reducers: {
    setType(state, action) {
      state.type = action.payload.type
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDefectAsyncThunk.fulfilled, (state, action) => {
        state.user = {};
      })
      .addCase(getDefectAsyncThunk.fulfilled, (state, action) => {
        state.defect = action.payload;
      })
      .addCase(getDefectsAsyncThunk.fulfilled, (state, action) => {
        state.defects = {
          ...action.payload,
          data: action.payload.first ? action.payload.data : [...state.defects.data, ...action.payload.data],
          current_page: state.defects.data.length ? state.defects.current_page++ : 1
        };
      })
      .addCase(getCommonDefectsAsyncThunk.fulfilled, (state, action) => {
        //console.log("commonDefects", action.payload)
        state.commonDefects = action.payload
        // state.commonDefects = {
        //   ...action.payload,
        //   data: action.payload.first ? action.payload.data : [...state.commonDefects.data, ...action.payload.data],
        //   current_page: state.commonDefects.data.length ? state.defects.current_page++ : 1
        // };
      })
      // im using addMatcher to manage the asyncthunksMehtod actions like fullfilled,pending,rejected and also to manage the errors loading and error messages and async params
      .addMatcher(
        // isAsyncThunk will run when the action is an asyncthunk exists from giver asycntthunks
        isAnyOf(
          // reduxToolKitCaseBuilder helper make fullfilled, pending, and rejected cases
          ...(reduxToolKitCaseBuilder([
            createDefectAsyncThunk,
            getDefectAsyncThunk,
            getDefectsAsyncThunk,
            getCommonDefectsAsyncThunk,
            deleteDefectAsyncThunk,
          ]))
        ),
        handleLoading
      );
  },
});

export default defectSlice.reducer;
export const { setType } = defectSlice.actions;
