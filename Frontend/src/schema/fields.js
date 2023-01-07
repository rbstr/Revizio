import moment from 'moment';
import * as yup from 'yup'

/**
  * Definice/validace formulářových entit
  */


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const firstName = yup
    .string()
    .strict(true)
    .max(32, "Křestní jméno nemůže být delší než 32 znaků")
    .required('Křestní jméno je povinné');
export const lastName = yup
    .string()
    .strict(true)
    .max(32, "Příjmení nemůže být delší než 32 znaků")
    .required('Příjmení je povinné');
export const objectManagerName = yup
    .string()
    .max(32, "Název správce budovy nemůže být delší než 32 znaků")
export const street = yup
    .string()
    .strict(true)
    .max(52, "Ulice nemůže být delší než 32 znaků")
    .required('Ulice je povinná');
export const city = yup
    .string()
    .strict(true)
    .max(32, "Město nemůže být delší než 32 znaků")
    .required('Město je povinné');
export const ownerAttended = yup
    .string()
    .strict(true)
    .required('Zúčastněná osoba je povinná');
export const zipCode = yup.string()
    .required()
    .matches(/^[0-9 ]+$/, "PSČ mohou být pouze čísla")
    .min(5, 'PSČ musí mít minimálně 5 znaků')
    .max(6, 'PSČ je příliš dlouhé')
    
export const majorDefects = yup
    .mixed().required('Závady bránící provozu jsou povinné').default(["Bez zjevných závad."])
    .test('majorDefects', '"Bez závad" nemůže být vybráno se závadou!', function (value) {
        if (value.includes("Bez zjevných závad.") && value.length > 1) {
            return false;
        }
        return true;
    });
    
// If Without Defect is selected with other options then it will be invalid
export const minorDefects = yup
    .mixed().required('Závady nebránící provozu jsou povinné').default(["Bez zjevných závad."])
    .test('minorDefects', '"Bez závad" nemůže být vybráno se závadou!', function (value) {
        if (value.includes("Bez zjevných závad.") && value.length > 1) {
            return false;
        }
        return true;
    });

export const deviceDefects = yup
    .mixed().required('Závady spotřebiče jsou povinné').default(["Bez zjevných závad."])
    .test('minorDefects', '"Bez závad" nemůže být vybráno se závadou!', function (value) {
        if (value.includes("Bez zjevných závad.") && value.length > 1) {
            return false;
        }
        return true;
    });
    
export const previousDefects = yup
    .mixed().required('Předchozí závady jsou povinné');
export const previousRevision = yup
    .string().required('Předchozí revize jsou povinné');
export const otherInformation = yup
    .string();
export const nextRevisionDate = yup
.mixed().required('Datum další revize je povinný').default(moment().format("DD. MM. YYYY"));

export const removeDefectsBefore = yup
    .mixed().default(moment().format("DD. MM. YYYY"));
export const flatPosition = yup
    .string();
export const devicePosition = yup
    .mixed().required('Umístění spotřebiče je povinné');
export const threadType = yup
    .mixed().required('Typ závitu je povinný');
export const connectionMethod = yup
    .string().required('Způsob zapojení je povinný');
export const totalMaxConsumptionOfNaturalGas = yup
    .string().required('Maximální spotřeba zemní plynu je povinná');
export const telephoneNumber = yup
    .string().matches(phoneRegExp, 'Telefonní číslo není ve správném formátu').required('Telefonní číslo je povinné');
export const performanceCheck = yup
    .array()
    // .oneOf(['Tightness inspection', 'Valves inspection', 'Device inspection', 'CO detection',], 'Select atleast one is not valid')
    .required('Provedené kontroly jsou povinné');
export const email = yup
    .string()
    .email("Email není ve správném formátu")
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Email musí obsahovat validní doménu")
    .required('Email je povinný');

export const password = yup
    .string()
    .min(6, ({ min }) => `Heslo musí mít alespoň ${min} znaků!`)
    .required('Heslo je povinné')

export const confirmPassword = yup
    .string()
    .required('Potvrzení hesla je povinné')
    .when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            "Hesla se musí shodovat!"
        )
    })
export const certificate = yup
    .string()
    .required('Číslo osvědčení je povinné')
export const authorization = yup
    .string()
    .required('Číslo oprávnění je povinné')   

export const executingPlace = yup
    .string()
    .strict(true)
    .required('Místo působení je povinné')
export const gasDetectorName = yup
    .string()
    .strict(true)
    .required('Název detektoru plynu je povinné');
export const pressureGaugeName = yup
    .string()
    .strict(true)
    .required('Název tlakoměru je povinné');
export const coPresenceName = yup
    .string()
    .strict(true)
    .required('Detektor výskytu CO je povinný');

export const serialNumber = yup
    .string()
    .required('Výrobní číslo je povinné')

export const evidenceNumber = yup
    .string()
    .strict(true)
    .required('Evidenční číslo je povinné')

export const deviceName = yup
    .string()
    .strict(true)
    .required('Název spotřebiče je povinný')

export const deviceSafe = yup
    .bool()
    .required('Výsledek revize je povinný')


export const addresses = yup.array()
.of(
  yup.object().shape({
    city,
    street,
    zipCode
  })
)
.required('Required').default([{city:"",street:"",zipCode:""}])