import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { firestore, storage } from "config/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, serverTimestamp, where, startAt, endAt } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { catchAsync, checkObjectvalues, handleLoading, reduxToolKitCaseBuilder } from "helpers/detectError";
import { decrementRevisionPerMonth, getRevisionPerMonth, incrementRevisionPerMonth, yymm } from "helpers/firebaseHelper";
import fileDownload from "js-file-download";
import moment from "moment";
import { toast } from "react-toastify";

/**
  * Slice pro revize
  * @return {} slice
  */

// Uložení podpisu
export const saveSignature = async ({ img, }) => {
  //console.log('going to upload image')
  const mountainsRef = ref(storage, `signature/${Date.now()}`);
  const uploadedImage = await uploadString(mountainsRef, img, 'data_url')
  //console.log('uploadedImage', uploadedImage)

  return (await getDownloadURL(mountainsRef))
}

// Uložení PDF
export const savePdf = async ({ type, pdfString }) => {
  if (!pdfString) return null
  const mountainsRef = ref(storage, `pdf-${type}-${Date.now()}`);
  const uploadedImage = await uploadString(mountainsRef, pdfString, 'data_url')
  //console.log('uploadedImage', uploadedImage)
  return (await getDownloadURL(mountainsRef));
}

// Uložení klienta
export const saveClient = async ({ data, uid }) => {
  const docRef = collection(firestore, "client");
  const q = query(docRef, where("email", "==", data.email), where("userId", "==", uid));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    const oldClient = querySnapshot.docs[0].data()
    if (oldClient.street !== data.street || oldClient.city !== data.city || oldClient.zipCode !== data.zipCode) {
      const addresses = [...(oldClient?.addresses ? oldClient?.addresses : [])]
      addresses.push({ street: data.street, city: data.city, zipCode: data.zipCode })
      addresses.push({ street: oldClient.street, city: oldClient.city, zipCode: oldClient.zipCode })
      await setDoc(querySnapshot.docs[0].ref, {
        ...checkObjectvalues(data), addresses: addresses.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.street === value.street && t.city === value.city && t.zipCode === value.zipCode
          ))
        ), userId: uid
      }, { merge: true });
    }
    return querySnapshot.docs[0].id;
  } else {
    const docRef = doc(collection(firestore, "client"));
    await setDoc(
      docRef,
      { ...checkObjectvalues(data), timestamp: serverTimestamp(), userId: uid },
      { merge: true }
    );
    return docRef.id;
  }
}

// Uložení měření
export const saveTest = async ({ data, uid }) => {
  if (data) {
    const docRef = doc(collection(firestore, "performedTests"));
    await setDoc(
      docRef,
      { ...checkObjectvalues(data), timestamp: serverTimestamp(), userId: uid },
      { merge: true }
    );
    return docRef.id;
  } else {
    return false;
  }
}

// Vytvoření revize
export const createRevisionAsyncThunk = createAsyncThunk(
  "revision/createRevisionAsyncThunk",
  catchAsync(async ({ type, handleNext, pdfString, PDFPressureTemplateString }, { getState }) => {
    const state = getState();
    const revData = state.revision.revisionForm[type];
    var [
      pdfUrl,
      pdfReportUrl,
      signImg,
      clientId,
    ] = await Promise.all([
      savePdf({ type, pdfString }),
      savePdf({ type: type + '-report', pdfString: PDFPressureTemplateString }),
      saveSignature({ img: state.revision.revisionForm[type]?.signImg }),
      saveClient({ data: revData.basicInformation, uid: state.auth.uid }),
    ])
    var performedTestsId = null;
    if (pdfReportUrl && type == "initial") {
      performedTestsId = await saveTest({ data: { ...revData.performedTests, pdfReportUrl, clientId }, uid: state.auth.uid })
    }

    const collRef = collection(firestore, "revisions");
    const savedDoc = await setDoc(

      state.revision.revisionForm[type].id ? doc(collRef, state.revision.revisionForm[type].id) : doc(collRef), {
      timestamp: serverTimestamp(),
      type,
      clientId,
      userId: state.auth.uid,
      techInformation: revData.techInformation,
      foundDefects: revData.foundDefects,
      additionalInformation: revData.additionalInformation,
      // ...(type == "initial" && { performedTests: revData.performedTests }),
      ...(type === "initial" && { performedTestsId }),
      ...(type === "initial" && pdfReportUrl && { pdfReportUrl }),
      ...(signImg && { signImg }),
      ...(pdfUrl && { pdfUrl }),
    }, { merge: true });
    
    if (state.revision.revisionForm[type].id) {
      toast.success("Revize úspěšně upravena.")
    } else {
      await incrementRevisionPerMonth(state.auth.uid)
      toast.success("Revize úspěšně uložena!")

    }
    if (handleNext) handleNext()
    return savedDoc;
  })
);


// Stažení PDF revize
export const downloadRevisionPdfFileAsyncThunk = createAsyncThunk(
  "revision/downloadRevisionPdfFileAsyncThunk",
  catchAsync(async ({ url, fileName }, { getState }) => {
    fetch(url)
      .then((response) => response.blob())
      .then((myBlob) => {
        fileDownload(myBlob, fileName)

      });
    return true;
  })
);

// Get revize pro přehled
export const dashboardAsyncThunk = createAsyncThunk(
  "revision/dashboardAsyncThunk",
  catchAsync(async (_, { getState }) => {
    const data = await getRevisionPerMonth()
    return data ?? initialState.analytics;
  })
);

// Get revize
export const getRevisionAsyncThunk = createAsyncThunk(
  "revision/getRevisionAsyncThunk",
  catchAsync(async ({ id }, { getState }) => {
    const docRef = doc(firestore, "revisions", id);
    const profile = await getDoc(docRef);
    if (profile.exists()) {
      return profile.data();
    }
    //console.log('Profile is not updated:', profile)
    throw ("Mám potíže získat revizi.");
  })
);

// Get revize z id
export const getRevisionsbyIdAsyncThunk = createAsyncThunk(
  "revision/getRevisionsbyIdAsyncThunk",
  catchAsync(async ({ perPage, id, first }, { getState }) => {
    const state = getState();
    var q;
    if (state.revision.revisionsbyId.data.length && !first) {
      q = query(collection(firestore, "revisions"),
        orderBy("timestamp"),
        where("clientId", "==", id),
        where("userId", "==", state.auth.uid),
        // startAfter(state.revision.revisions.lastItem),
        limit(perPage ?? 10));
    } else {

      q = query(collection(firestore, "revisions"),
        orderBy("timestamp"),
        where("clientId", "==", id),
        where("userId", "==", state.auth.uid),
        limit(perPage ?? 10));
    }

    // const q = query(collection(firestore, "profile"), orderBy("firstName"), limit(12));
    const querySnapshot = await getDocs(q);

    // const querySnapshot = await getDocs(collection(firestore, "profile"));
    const data = [];
    querySnapshot.forEach(el => {
      data.push({ ...el.data(), id: el.id })
    })
    //console.log('getRevisionsbyIdAsyncThunk:', data)
    return {
      loadMore: data.length === +perPage,
      data,
      first: !!first,
      lastItem: querySnapshot.size > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,

    };
  })
);

// Get revize
export const getRevisionsAsyncThunk = createAsyncThunk(
  "revision/getRevisionsAsyncThunk",
  catchAsync(async ({ perPage, search, first }, { getState }) => {
    const state = getState();
    //console.log('state:', state.auth.uid)
    var q;
    if (state.revision.revisions.data.length && !first) {
      q = query(collection(firestore, "revisions"),
        where("userId", "==", state.auth.uid),
        ...(search ?
          [orderBy("techInformation.evidenceNumber"), orderBy("timestamp"), startAt(search.toLowerCase()),
          endAt(search.toLowerCase() + "\uf8ff")] : [orderBy("timestamp", "desc")]
        ),
        startAfter(state.revision.revisions.lastItem),
        limit(perPage ?? 10));
    } else {

      q = query(collection(firestore, "revisions"),
        where("userId", "==", state.auth.uid),
        // orderBy("clientId"),
        ...(search ?
          [orderBy("techInformation.evidenceNumber"), orderBy("timestamp"),
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
    // 



    async function fetchFeedPosts(postIds = []) {
      const promises = postIds.map(async (postId) => {
        const docData = await getDoc(doc(firestore, "client", postId));
        return { ...docData.data(), id: docData.id };
      });
      // Resolve all posts promise result into single array
      const feedPosts = await Promise.all(promises);
      return feedPosts;
    }
    const results = await fetchFeedPosts(
      data.filter((value, index, self) => self.indexOf(value) === index).map(el => el.clientId)
    );
    //console.log('data:', data)
    //console.log('results:', results)
    return {
      loadMore: data.length === +perPage,
      data: data.map(el => { return { ...el, client: results.find(i => el.clientId === i.id) } }),
      first: !!first,
      lastItem: querySnapshot.size > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
    };
  })
);

// Odstranění revize
export const deleteRevisionAsyncThunk = createAsyncThunk(
  "revision/deleteRevisionAsyncThunk",
  catchAsync(async ({ id, navigate, fetchList, clientId, callBack }, { dispatch, getState }) => {
    const state = getState();
    const rev = await getDoc(doc(firestore, "revisions", id))
    if (rev.exists()) {
      await deleteDoc(doc(firestore, "revisions", id));
      await deleteDoc(doc(firestore, "performedTests", rev.data().performedTestsId));
      await decrementRevisionPerMonth({ ryymm: moment(rev.data().timestamp.seconds * 1000).format('YYYY/MM'), userId: state.auth.uid })
    }
    dispatch(dashboardAsyncThunk())
    //console.log("rev:", moment(rev.data().timestamp.seconds * 1000).format('YYYY/MM'))
    if (fetchList) {
      if (clientId) {
        dispatch(getRevisionsbyIdAsyncThunk({ id: clientId, perPage: 5, first: true }));
      } else {
        dispatch(getRevisionsAsyncThunk({ perPage: 10, search: "", first: true }));
      }
    }
    if (navigate) navigate('/clients/revisions')
    if (callBack) callBack()
    return true;
  })
);

const initialState = {
  //states
  revision: {},
  pdfRevisionData: {},
  revisionsbyId: {
    current_page: 1,
    loadMore: true,
    data: [],
  },
  revisions: {
    current_page: 1,
    loadMore: true,
    data: [],
  },
  // revisions: {
  //   page:1,
  //   perPage:5,
  //   rows:[],
  // },
  analytics: {
    revCount: 0,
    [yymm]: 0
  },
  revisionForm: {
    initial: {
      clientId: null,
      signImg: null,
      performedTests: {},
      basicInformation: {},
      techInformation: {},
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

const revisionSlice = createSlice({
  name: "revision",
  initialState,
  reducers: {
    resetRevisionForm(state, action) {
      state.revisionForm = {
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
      }
    },
    setPdfRevisionData(state, action) {
      state.pdfRevisionData = { ...action.payload };
    },
    setBasicInformation(state, action) {
      state.revisionForm[action.payload.type] = {
        ...state.revisionForm[action.payload.type],
        basicInformation: action.payload.data,
      };
    },
    setPerformedTests(state, action) {
      state.revisionForm[action.payload.type] = {
        ...state.revisionForm[action.payload.type],
        performedTests: action.payload.data
      };
    },
    setTechInformation(state, action) {
      state.revisionForm[action.payload.type] = {
        ...state.revisionForm[action.payload.type],
        techInformation: action.payload.data
      };
    },
    setFoundDefects(state, action) {
      state.revisionForm[action.payload.type] = {
        ...state.revisionForm[action.payload.type],
        foundDefects: action.payload.data
      };
    },
    setAdditionalInformation(state, action) {
      state.revisionForm[action.payload.type] = {
        ...state.revisionForm[action.payload.type],
        additionalInformation: action.payload.data,
        signImg: action.payload.signImg
      };
    },
    setRevisionData(state, action) {
      state.revisionForm[action.payload.type] = { ...action.payload };
    },
    setEditRevision(state, action) {
      state.revisionForm[action.payload.type] = {
        ...state.revisionForm[action.payload.type],
        additionalInformation: action.payload.data,
        signImg: action.payload.signImg,
        edit: true
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRevisionAsyncThunk.fulfilled, (state, action) => {
        state.user = {};
      })
      .addCase(getRevisionAsyncThunk.fulfilled, (state, action) => {
        state.revision = action.payload;
      })
      .addCase(getRevisionsAsyncThunk.fulfilled, (state, action) => {
        state.revisions = {
          ...action.payload,
          data: action.payload.first ? action.payload.data : [...state.revisions.data, ...action.payload.data],
          current_page: state.revisions.data.length ? state.revisions.current_page++ : 1
        };
      })
      .addCase(getRevisionsbyIdAsyncThunk.fulfilled, (state, action) => {
        state.revisionsbyId = {
          ...action.payload,
          data: action.payload.first ? action.payload.data : [...state.revisions.data, ...action.payload.data],
          current_page: state.revisions.data.length ? state.revisions.current_page++ : 1
        };
      })
      .addCase(dashboardAsyncThunk.fulfilled, (state, action) => {
        state.analytics = action.payload
      })
      // im using addMatcher to manage the asyncthunksMehtod actions like fullfilled,pending,rejected and also to manage the errors loading and error messages and async params
      .addMatcher(
        // isAsyncThunk will run when the action is an asyncthunk exists from giver asycntthunks
        isAnyOf(
          // reduxToolKitCaseBuilder helper make fullfilled, pending, and rejected cases
          ...(reduxToolKitCaseBuilder([
            createRevisionAsyncThunk,
            downloadRevisionPdfFileAsyncThunk,
            getRevisionAsyncThunk,
            getRevisionsbyIdAsyncThunk,
            getRevisionsAsyncThunk,
            deleteRevisionAsyncThunk,
            dashboardAsyncThunk,
          ]))
        ),
        handleLoading
      );
  },
});

export default revisionSlice.reducer;
export const { setBasicInformation, setPerformedTests, setTechInformation, setFoundDefects, setAdditionalInformation, setEditRevision, setRevisionData, setPdfRevisionData, resetRevisionForm } = revisionSlice.actions;
