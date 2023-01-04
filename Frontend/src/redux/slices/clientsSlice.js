import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { firestore } from "config/firebase";
import { collection, deleteDoc, doc, endAt, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, startAt, where, writeBatch } from "firebase/firestore";
import { catchAsync, handleLoading, reduxToolKitCaseBuilder } from "helpers/detectError";
import { toast } from "react-toastify";

// create client async thunk
export const updateClientAsyncThunk = createAsyncThunk(
  "client/updateClientAsyncThunk",
  catchAsync(async ({ data, callBack }, { getState }) => {
    const { auth: { uid } } = getState()

    const docRef = collection(firestore, "client");
    await setDoc(doc(docRef, data.id), { ...data, userId: uid }, { merge: true })
    if(callBack) callBack()
    toast.success("Údaje klienta úspěšně aktualizované.")
  })
);
// create client async thunk
export const createClientAsyncThunk = createAsyncThunk(
  "client/createClientAsyncThunk",
  catchAsync(async ({ data }, { getState }) => {
    const { auth: { uid } } = getState()
    const docRef = collection(firestore, "client");
    const saveClient = await setDoc(doc(docRef), { ...data, userId: uid });
    //console.log('saveClient:', saveClient)
  })
);

// get client for id async thunk
export const getClientbyEmailAsyncThunk = createAsyncThunk(
  "client/getClientbyEmailAsyncThunk",
  catchAsync(async ({ email }, { getState }) => {
    const docRef = doc(firestore, "client");
    const q = query(docRef, where("capital", "==", email));
    const profile = await getDoc(q);
    if (profile.exists()) {
      //console.log('client:', profile.data())
      return profile.data();
    }
    //console.log('getClientbyEmailAsyncThunk:', profile)
    throw ("Tento profil neexistuje.");
  })
);
// get client for id async thunk
export const getClientAsyncThunk = createAsyncThunk(
  "client/getClientAsyncThunk",
  catchAsync(async ({ id }, { getState }) => {
    const docRef = doc(firestore, "client", id);
    const profile = await getDoc(docRef);
    if (profile.exists()) {
      //console.log('client:', profile.data())
      return profile.data();
    }
    //console.log('Profile is not updated:', profile)
    throw ("Mám potíže získat profil.");
  })
);
// get client async thunk
export const getClientsAsyncThunk = createAsyncThunk(
  "client/getClientsAsyncThunk",
  catchAsync(async ({ perPage, search, first }, { getState }) => {
    const state = getState();
    //console.log('state:', state.auth.uid)
    var q;
    if (state.client.clients.data.length && !first) {
      q = query(collection(firestore, "client"),
        where("userId", "==", state.auth.uid),
        ...(search ?
          [orderBy("firstName"),
          startAt(search.toLowerCase()),
          endAt(search.toLowerCase() + "\uf8ff")] : [orderBy("timestamp")]
        ),
        startAfter(state.client.clients.lastItem),
        limit(perPage ?? 10));

    } else {
      q = query(collection(firestore, "client"),
        where("userId", "==", state.auth.uid),
        ...(search ?
          [orderBy("firstName"),
          startAt(search.split(" ")[0].toLowerCase()),
          endAt(search.split(" ")[0].toLowerCase() + "\uf8ff"),
          ] : [orderBy("timestamp")]
        ),
        limit(perPage ?? 10)
      );
    }
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach(el => {
      if (search && search.split(" ").length > 1) {
        if (el.data()?.lastName?.includes(search.split(" ")[1])) {
          data.push({ ...el.data(), id: el.id })
        }
      } else {
        data.push({ ...el.data(), id: el.id })
      }
    })
    return {
      loadMore: data.length == +perPage,
      data,
      first: !!first,
      lastItem: querySnapshot.size > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
    };
  })
);


// logout async thunk
export const deleteClientAsyncThunk = createAsyncThunk(
  "client/deleteClientAsyncThunk",
  catchAsync(async ({ id, navigate }, { getState }) => {
    await deleteDoc(doc(firestore, "client", id));
    const state = getState();
    // this taks should perform using promise.all but let it works for now
    // delte revisions
    const q = query(collection(firestore, "revisions"),
      where("userId", "==", state.auth.uid),
      where("clientId", "==", id)
    );
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(firestore);
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    // delete reports
    const q1 = query(collection(firestore, "performedTests"),
      where("userId", "==", state.auth.uid),
      where("clientId", "==", id)
    );
    const querySnapshot1 = await getDocs(q1);
    const batch1 = writeBatch(firestore);
    querySnapshot1.forEach(doc => {
      batch1.delete(doc.ref);
    });
    await batch1.commit();

    if (navigate) navigate('/clients')
    return true;
  })
);

const initialState = {
  //states
  client: {},
  clients: {
    current_page: 1,
    loadMore: true,
    data: [],
    lastItem: null
  },

  // manager states
  errors: {},
  loadings: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    resetClientFields: (state, action) => {
      state.client = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClientAsyncThunk.fulfilled, (state, action) => {
        state.user = {};
      })
      .addCase(getClientAsyncThunk.fulfilled, (state, action) => {
        state.client = action.payload;
      })
      .addCase(getClientsAsyncThunk.fulfilled, (state, action) => {
        state.clients = {
          ...action.payload,
          data: action.payload.first ? action.payload.data : [...state.clients.data, ...action.payload.data],
          current_page: state.clients.data.length ? state.clients.current_page++ : 1,
        };
      })
      .addCase(deleteClientAsyncThunk.fulfilled, (state, action) => {
      })
      // im using addMatcher to manage the asyncthunksMehtod actions like fullfilled,pending,rejected and also to manage the errors loading and error messages and async params
      .addMatcher(
        // isAsyncThunk will run when the action is an asyncthunk exists from giver asycntthunks
        isAnyOf(
          // reduxToolKitCaseBuilder helper make fullfilled, pending, and rejected cases
          ...(reduxToolKitCaseBuilder([
            createClientAsyncThunk,
            updateClientAsyncThunk,
            getClientAsyncThunk,
            getClientsAsyncThunk,
            deleteClientAsyncThunk,
            getClientbyEmailAsyncThunk,
          ]))
        ),
        handleLoading
      );
  },
});

export default clientSlice.reducer;
export const { setUser, logout } = clientSlice.actions;
export const { resetClientFields } = clientSlice.actions;
