import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { auth, firestore, messaging, storage } from "config/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  deleteField,
} from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  catchAsync,
  handleLoading,
  reduxToolKitCaseBuilder,
} from "helpers/detectError";
import { toast } from "react-toastify";

/**
  * Slice pro autentizaci
  * @return {} slice
  */


function isIOS() {
  const browserInfo = navigator.userAgent.toLowerCase();
  
  if (browserInfo.match('iphone') || browserInfo.match('ipad')) {
    return true;
  }
  if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
    return true;
  } 
  return false;
}

function isGranted() {
  if (isIOS()) return;
  return Notification.permission === "granted"
}

// Přihlášení/Registrace pomocí Google
export const loginWithGoogleAsyncThunk = createAsyncThunk(
  "auth/loginWithGoogleAsyncThunk",
  catchAsync(async ({ handleToggleModal }, _) => {
    const provider = new GoogleAuthProvider();
    const registeredUser = await signInWithPopup(auth, provider);

    const profileRef = collection(firestore, "profile");
    const profile = await setDoc(doc(profileRef, registeredUser.user.uid), {
      firstName: registeredUser.user.displayName.split(" ")?.[0],
      lastName: registeredUser.user.displayName.split(" ")?.[1],
      email: registeredUser.user.email,
      createdAt: serverTimestamp(),
    });
   
    handleToggleModal();
    return {
      registeredUser,
      profile,
    };
  })
);
// Zapomenuté heslo
export const sendPasswordResetEmailAsyncThunk = createAsyncThunk(
  "auth/sendPasswordResetEmailAsyncThunk",
  catchAsync(async ({ email }, _) => {
    console.log("email:::", email);
    const result = await sendPasswordResetEmail(auth, email)
      .then((r) => console.log("res::::", r))
      .catch((err) => console.log("err:", err));
    //console.log("result:", result);
    toast.success(
      "Email pro obnovu hesla byl úspěšně odeslán!"
    );
    return {
      result,
    };
  })
);
// Registrace
export const registerAsyncThunk = createAsyncThunk(
  "auth/registerAsyncThunk",
  catchAsync(async ({ data, handleToggleModal }, { dispatch }) => {
    // console.log("parma:", data)
    const registeredUser = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const updatedUser = await updateProfile(auth.currentUser, {
      displayName: data.firstName + " " + data.lastName,
    });
    const profileRef = collection(firestore, "profile");
    const profile = await setDoc(doc(profileRef, registeredUser.user.uid), {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      timestamp: serverTimestamp(),
    });
    handleToggleModal();
    dispatch(getProfileAsyncThunk());
    return {
      registeredUser,
      profile,
    };
  })
);

// Přihlášení
export const loginAsyncThunk = createAsyncThunk(
  "auth/loginAsyncThunk",
  catchAsync(async ({ data, handleToggleModal }, _) => {
    // console.log("parma:", data)
    
    const user = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password);
    // console.log('user:', user)
    handleToggleModal();
    toast.success(`Uživatel ${user.user.displayName} úspěšně přihlášen.`);
    
    return user;
  })
);
// Get nastavení uživatele
export const getSettingsAsyncThunk = createAsyncThunk(
  "auth/getSettingsAsyncThunk",
  catchAsync(async (_, { getState, dispatch }) => {
    const state = getState();
    // console.log('state:', state.auth.uid)
    const docRef = doc(firestore, "settings", state.auth.uid);
    const settings = await getDoc(docRef);
    if (settings.exists()) {
      // console.log('settings:', settings.data())
      return settings.data();
    }
  })
);
// Set nastavení uživatele
export const setSettingsAsyncThunk = createAsyncThunk(
  "auth/setSettingsAsyncThunk",
  catchAsync(async ({ data, callBack, ...everything }, { getState }) => {
    const state = getState();
    if(!state.auth.uid) return;
    const docRef = doc(firestore, "settings", state.auth.uid);
    await setDoc(
      docRef,
      data,
      { merge: true }
    );
    // console.log('settings is created/updated:', settings)
    if (callBack) callBack();
  })
);
// Get uživatele
export const getProfileAsyncThunk = createAsyncThunk(
  "auth/getProfileAsyncThunk",
  catchAsync(async (_, { getState }) => {
    const state = getState();
    // console.log('state:', state.auth.uid)
    const docRef = doc(firestore, "profile", state.auth.uid);
    const profile = await getDoc(docRef);
    if (profile.exists()) {
      // console.log('profile:', profile.data())
      return profile.data();
    }
    // console.log('Profile is not updated:', profile)
    throw { message: "Mám potíže získat profil.", code: 401 };
  })
);
// Editace/uložení změn uživatele
export const createProfileAsyncThunk = createAsyncThunk(
  "auth/createProfileAsyncThunk",
  catchAsync(async ({ data, image, callBack }, { getState, dispatch }) => {
    const state = getState();
    // console.log('state:', state.auth.uid)
    //
    var imageUrl;
    if (image) {
      // console.log('going to upload image')
      const mountainsRef = ref(storage, `images/${image?.name}`);
      const uploadedImage = await uploadBytes(mountainsRef, image);
      // console.log('uploadedImage', uploadedImage)
      imageUrl = await getDownloadURL(mountainsRef);
      // console.log('imageUrl', imageUrl)
    }

    //
    // console.log('parmans:::', data)
    const profileRef = collection(firestore, "profile");
    // if(imageUrl) data['imageUrl']=imageUrl
    const savedProfile = await setDoc(
      doc(profileRef, state.auth.uid),
      { ...data, ...(imageUrl && { imageUrl }) },
      { merge: true }
    );
    // console.log('savedProfile:', savedProfile)
    toast.success("Profil úspěšně aktualizován.");
    dispatch(getProfileAsyncThunk());
    if(callBack) callBack()
    return savedProfile;
  })
);
// Odhlášení uživatele
export const logoutAsyncThunk = createAsyncThunk(
  "auth/logoutAsyncThunk",
  catchAsync(async ({ navigate }, _) => {
    if (isGranted()) {
      const token = await getToken(messaging);
      if (token) {
        setDoc(
          doc(firestore, "settings", auth.currentUser.uid),
          {
            [token]: deleteField()
          },
          { merge: true }
        );
      }
    }
    const res = await signOut(auth);
    // console.log('res', res)
    navigate("/");
    return res;
  })
);

const initialState = {
  //states
  user: {},
  profile: {},
  isLoggedIn: false,
  _tokenResponse: {},
  uid: null,
  url: "",
  savedId: "",
  currentIndex: 0,
  finish: false,
  settings: {},
  // manager states
  errors: {},
  loadings: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.uid = action.payload.user.uid;
      state.isLoggedIn = true;
    },
    logout(state, action) {
      state.user = {};
      state.isLoggedIn = false;
      state.uid = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsyncThunk.fulfilled, (state, action) => {
        state.user = action.payload.registeredUser.user;
        state.profile = action.payload.profile;
      })
      .addCase(loginWithGoogleAsyncThunk.fulfilled, (state, action) => {
        state.user = action.payload.registeredUser.user;
        state.profile = action.payload.profile;
      })
      .addCase(loginAsyncThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state._tokenResponse = action.payload._tokenResponse;
        state.isLoggedIn = true;
        state.uid = action.payload.user.uid;
      })
      .addCase(logoutAsyncThunk.fulfilled, (state, action) => {
        state.user = {};
        state._tokenResponse = {};
        state.isLoggedIn = false;
        state.uid = null;
      })
      .addCase(getProfileAsyncThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(getSettingsAsyncThunk.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      // im using addMatcher to manage the asyncthunksMehtod actions like fullfilled,pending,rejected and also to manage the errors loading and error messages and async params
      .addMatcher(
        // isAsyncThunk will run when the action is an asyncthunk exists from giver asycntthunks
        isAnyOf(
          // reduxToolKitCaseBuilder helper make fullfilled, pending, and rejected cases
          ...reduxToolKitCaseBuilder([
            registerAsyncThunk,
            sendPasswordResetEmailAsyncThunk,
            loginAsyncThunk,
            logoutAsyncThunk,
            createProfileAsyncThunk,
            getProfileAsyncThunk,
            loginWithGoogleAsyncThunk,
            getSettingsAsyncThunk,
            setSettingsAsyncThunk,
          ])
        ),
        handleLoading
      );
  },
});

export default authSlice.reducer;
export const { setUser, logout } = authSlice.actions;
