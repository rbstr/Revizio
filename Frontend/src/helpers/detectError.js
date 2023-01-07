import { toast } from "react-toastify";


/**
  * Pomocník pro správu chyb
  *
  */

export const checkArray = (e) => (Array.isArray(e) ? e : [e]);

export const detectError = (error, dispatch, rejectWithValue) => {

  if (rejectWithValue) {
    if (error.message.includes('user-not-found')) {
      toast.error('Špatné přihlašovací údaje!')

    } else if (error.message.includes('wrong-password')) {
      toast.error('Špatné přihlašovací údaje!')

    } else if (error.message.includes('email-already-in-use')) {
      toast.error("Tento email je již zaregistrovaný.")

    } else if (error.message.includes('network-request-failed')) {
      toast.error('Potíže s připojením!')

    } else if (error.message.includes('auth/popup-closed-by-user')) {
      toast.warning('Okno pro přihlášení uzavřeno.')

    }

    else {
      toast.error('Něco se pokazilo.')

    }
    return rejectWithValue(error);
  }
};

export const spreadObjValuesNotNull = (ob) => {
  // const keysToParse = ["properties", "levels", "stats"];
  if (typeof ob === "object" && ob) {
    const tempObj = {};
    Object.keys(ob).forEach((key) => {
      // if (keysToParse.includes(key)) {
      //   tempObj[key] = ob[key] == "undefined" ? [] : JSON.parse(ob[key]);
      // } else {
      tempObj[key] = ob[key] ?? "";
      // }
    });
    return tempObj;
  } else {
    return ob;
  }
};

//convert search params to opject
export function paramsToObject(entries) {
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export const mapAlterString = (_array, string) => {
  if (Array.isArray(_array) && _array.length > 0) {
    return _array.map((item) => item[string]);
  } else {
    return string;
  }
};
export const subStringNumber = (stirng, numbers) => {
  if (typeof stirng == "string" && stirng.length > numbers) {
    return stirng.substring(1, numbers) + "...";
  } else {
    return stirng;
  }
};
// handle error leading and server params
function handleLoading(state, { meta, payload, type }) {
  const action = type.split("/");
  if (meta?.arg && type.endsWith("/pending")) {
    state.paramsForThunk[action[1]] = meta?.arg;
  }
  if (type.endsWith("/rejected") && payload) {
    state.errorMessages[action[1]] =
      typeof payload === "string" ? payload :
        payload?.message ??
        "něco se pokazilo";
    state.errorCodes[action[1]] =
      payload?.code ?? payload?.response?.status ?? 401;
  }
  state.errors[action[1]] = type.endsWith("/rejected");
  state.loadings[action[1]] = type.endsWith("/pending");
}
export { handleLoading };


export const catchAsync = (fn) => (_, api) => {
  return Promise.resolve(fn(_, api)).catch((error) => {
    //console.log("catchAsync:", error)
    return detectError(error, api?.dispatch, api?.rejectWithValue)
  }
  );
};
export const reduxToolKitCaseBuilder = (cases) => {
  return cases.flatMap((el) => [el.pending, el.fulfilled, el.rejected]);
};


export const countToLevels = (n) => {
  return Object.entries(levels).find(([key, value]) => {
    if (n <= value) {
      return key;
    }
  });
};

export const levels = {
  Začátečník: 20,
  Pokročilý: 50,
  Zkušený: 150,
  Pro: 500,
  Mistr: 5000,
}

export const checkObjectvalues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, (v === Object(v) && !Array.isArray(v)) ? checkObjectvalues(v) : v])
  );
}

