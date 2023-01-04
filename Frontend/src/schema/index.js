import * as yup from 'yup'
import {
    authorization,
    certificate,
    confirmPassword,
    coPresenceName,
    email,
    executingPlace,
    firstName,
    gasDetectorName,
    lastName,
    password,
    pressureGaugeName,
    serialNumber,
    title,
    street,
    city,
    zipCode,
    objectManagerName,
    telephoneNumber,
    flatPosition,
    ownerAttended,
    evidenceNumber,
    deviceName,
    devicePosition,
    threadType,
    connectionMethod,
    performanceCheck,
    totalMaxConsumptionOfNaturalGas, 
    majorDefects,
    minorDefects,
    deviceDefects,   
    removeDefectsBefore,
    //previousDefects,
    previousRevision,
    otherInformation,
    nextRevisionDate,
    deviceSafe,
    addresses
} from './fields'

// login schema
export const loginSchema = yup.object().shape({
    email,
    password,
})

// register schema
export const registerSchema = yup.object().shape({
    firstName,
    lastName,
    email,
    password,
    confirmPassword
})
// register schema
export const profileSchema = yup.object().shape({
    firstName,
    lastName,
    email,
    telephoneNumber,
    //title,
    executingPlace,
    certificate,
    authorization,
    gasDetectorName,
    gasDetectorSerialNumber: serialNumber,
    coPresenceName,
    coPresenceSerialNumber: serialNumber,
    pressureGaugeName,
    pressureGaugeSerialNumber: serialNumber,
})

// 1st form revision initial basicInfo schema
export const basicInfoStepSchema = yup.object().shape({
    firstName,
    lastName,
    email,
    street,
    city,
    zipCode,
    // addresses,
    objectManagerName,
    flatPosition,
    telephoneNumber,
    ownerAttended
})
//2nd form revision technicalInfo schema
export const technicalInfoInitialSchema = yup.object().shape({
    evidenceNumber,
    deviceName,
    devicePosition,
    threadType,
    connectionMethod,
    performanceCheck,
    totalMaxConsumptionOfNaturalGas,
})
export const technicalInfoServiceSchema = yup.object().shape({
    evidenceNumber,
    deviceName,
    devicePosition,
    threadType,
    connectionMethod,
    performanceCheck,
})
export const foundDefectsSchema = yup.object().shape({
    majorDefects,
    minorDefects,
    deviceDefects,
    removeDefectsBefore,
})
export const additionalInfoSchema = yup.object().shape({
    //previousDefects,
    previousRevision,
    otherInformation,
    nextRevisionDate,
    deviceSafe,
})