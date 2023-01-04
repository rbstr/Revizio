import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { firestore, storage } from "config/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, serverTimestamp, where, startAt, endAt, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { catchAsync, handleLoading, reduxToolKitCaseBuilder } from "helpers/detectError";
import { toast } from "react-toastify";
import { saveClient, saveSignature } from "./revisionSlice";

// create pattern async thunk
export const createPatternAsyncThunk = createAsyncThunk(
  "pattern/createPatternAsyncThunk",
  catchAsync(async ({ type, handleNext, data }, { getState }) => {
    const state = getState();
    //console.log({ type, handleNext, data })
    //console.log('pattern will be:', state.revision.revisionForm[type])

    const revData = state.revision.revisionForm[type];
    const [
      signImg,
      clientId
    ] = await Promise.all([
      saveSignature({ img: state.revision.revisionForm[type]?.signImg }),
      saveClient({ data: revData.basicInformation, uid: state.auth.uid })
    ])
    // 
    const collRef = collection(firestore, "patterns");
    const savedDoc = await setDoc(doc(collRef), {
      ...data,
      timestamp: serverTimestamp(),
      type,
      clientId,
      userId: state.auth.uid,
      techInformation: revData.techInformation,
      foundDefects: revData.foundDefects,
      additionalInformation: revData.additionalInformation,
      ...(type == "initial" && { performedTests: revData.performedTests }),
      ...(signImg && { signImg })
    });
    //console.log('savedDoc:', collRef.id)
    if (handleNext) handleNext()
    toast.success("Vzor zprávy úspěšně uložen!")

    return savedDoc;
  })
);

// get pattern for id async thunk
export const getPatternAsyncThunk = createAsyncThunk(
  "pattern/getPatternAsyncThunk",
  catchAsync(async ({ id }, { getState }) => {
    const docRef = doc(firestore, "patterns", id);
    const profile = await getDoc(docRef);
    if (profile.exists()) {
      //console.log('pattern:', profile.data())
      return profile.data();
    }
    //console.log('Profile is not updated:', profile)
    throw ("Mám potíže získat vzory zpráv.");
  })
);
// get patterns async thunk
export const getPatternsAsyncThunk = createAsyncThunk(
  "pattern/getPatternsAsyncThunk",
  catchAsync(async ({ perPage, search, first }, { getState }) => {
    const state = getState();
    //console.log('state:', state.auth.uid)
    var q;
    if (state.pattern.patterns.data.length && !first) {
      q = query(collection(firestore, "patterns"),
        where("userId", "==", state.auth.uid),

        ...(search ?
          [orderBy("patternName"), orderBy("timestamp"), startAt(search.toLowerCase()),
          endAt(search.toLowerCase() + "\uf8ff")] : [orderBy("timestamp")]
        ),
        startAfter(state.pattern.patterns.lastItem),
        limit(perPage ?? 10));
    } else {

      q = query(collection(firestore, "patterns"),
        // orderBy("patternName"),
        where("userId", "==", state.auth.uid),

        ...(search ?
          [orderBy("patternName"), orderBy("timestamp"), startAt(search.toLowerCase()),
          endAt(search.toLowerCase() + "\uf8ff")] : [orderBy("timestamp")]
        ),
        limit(perPage ?? 10));
    }

    // const q = query(collection(firestore, "profile"), orderBy("firstName"), limit(12));
    const querySnapshot = await getDocs(q);

    // const querySnapshot = await getDocs(collection(firestore, "profile"));
    const data = [];
    querySnapshot.forEach(el => {
      data.push({ ...el.data(), id: el.id })
    })
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
export const renamePatternAsyncThunk = createAsyncThunk(
  "pattern/renamePatternAsyncThunk",
  catchAsync(async ({ id, data, handleNext }, { dispatch }) => {
    await updateDoc(doc(firestore, "patterns", id),data);
    dispatch(getPatternsAsyncThunk({ perPage: 10, search: "", first: true }))
    if (handleNext) handleNext()
    return true;
  })
);
// logout async thunk
export const deletePatternAsyncThunk = createAsyncThunk(
  "pattern/deletePatternAsyncThunk",
  catchAsync(async ({ id }, { dispatch }) => {
    await deleteDoc(doc(firestore, "patterns", id));
    dispatch(getPatternsAsyncThunk({ perPage: 10, search: "", first: true }))
    return true;
  })
);

const initialState = {
  //states
  pattern: {},
  patternIdToEdit: null,
  patternsbyId: {
    current_page: 1,
    loadMore: true,
    data: [],
  },
  patterns: {
    current_page: 1,
    loadMore: true,
    data: [],
  },

  patternForm: {
    initial: {
      signImg: null,
      basicInformation: {
        // dummy
        city: "Decin",
        email: "filip.rubes@tul.cz",
        firstName: "Filip",
        flatPosition: "vlevo",
        lastName: "Rubes",
        objectManagerName: "",
        ownerAttended: "p. Rubes",
        street: "Arbesova 2",
        telephoneNumber: "731951176",
        zipCode: "40502",
      },
      techInformation: {
        // dummy
        connectionMethod: "none",
        deviceName: "none",
        devicePosition: "v kuchyni",
        evidenceNumber: "545",
        performanceCheck: false,
        threadType: "dn15",
      },
      foundDefects: {},
      additionalInformation: {},
      edit: false
    },
    service: {
      signImg: null,
      edit: false,
      basicInformation: {
        // dummy
        city: "Decin",
        email: "filip.rubes@tul.cz",
        firstName: "Filip",
        flatPosition: "vlevo",
        lastName: "Rubes",
        objectManagerName: "",
        ownerAttended: "p. Rubes",
        street: "Arbesova 2",
        telephoneNumber: "731951176",
        zipCode: "40502",
      },
      techInformation: {
        // dummy
        connectionMethod: "none",
        deviceName: "none",
        devicePosition: "v kuchyni",
        evidenceNumber: "545",
        performanceCheck: false,
        threadType: "dn15",
      },
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

const patternSlice = createSlice({
  name: "pattern",
  initialState,
  reducers: {

    setPatternIdToEdit(state, action) {
      state.patternIdToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatternAsyncThunk.fulfilled, (state, action) => {
        state.pattern = action.payload;
      })
      .addCase(renamePatternAsyncThunk.fulfilled, (state, action) => {
        state.patternIdToEdit = null;
      })
      .addCase(getPatternsAsyncThunk.fulfilled, (state, action) => {
        state.patterns = {
          ...action.payload,
          data: action.payload.first ? action.payload.data : [...state.patterns.data, ...action.payload.data],
          current_page: state.patterns.data.length ? state.patterns.current_page++ : 1
        };
      })
      // im using addMatcher to manage the asyncthunksMehtod actions like fullfilled,pending,rejected and also to manage the errors loading and error messages and async params
      .addMatcher(
        // isAsyncThunk will run when the action is an asyncthunk exists from giver asycntthunks
        isAnyOf(
          // reduxToolKitCaseBuilder helper make fullfilled, pending, and rejected cases
          ...(reduxToolKitCaseBuilder([
            createPatternAsyncThunk,
            getPatternAsyncThunk,
            getPatternsAsyncThunk,
            deletePatternAsyncThunk,
          ]))
        ),
        handleLoading
      );
  },
});
export const { setPatternIdToEdit } = patternSlice.actions;
export default patternSlice.reducer;