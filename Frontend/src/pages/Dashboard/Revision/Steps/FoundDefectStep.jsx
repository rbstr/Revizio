import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { GridSection } from "components/GridSection";
// import { InputField } from "utils/InputField";
import { StepButtons } from "components/StepButtons";
import { InputDatePicker } from "utils/InputDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { setFoundDefects } from "redux/slices/revisionSlice";
import useYupValidationResolver from "schema/useYupValidationResolver";
import { foundDefectsSchema } from "schema";
import { Button, Chip, TextField, useMediaQuery } from "@mui/material";
import { DefectModal } from "components/DefectModal";
import { useModalContext } from "context/ModalContext";
import { ReactHookFormSelect } from "utils/SelectField";
import { getDefectsAsyncThunk, setType } from "redux/slices/defectSlice";
import { revisionTypes } from "utils/common";
import moment from "moment";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InputField } from "utils/InputField";
import { checkArray } from "helpers/detectError";
import { useTheme } from "@mui/material";
import { CalendarIcon } from "utils/icons";
import AddIcon from '@mui/icons-material/Add';
import { removeDefectsBefore } from "schema/fields";

export const FundDefectStep = ({
  type,
  activeStep,
  handleBack,
  handleNext,
}) => {
  // redux
  const {
    revisionForm: {
      [type]: { foundDefects },
    },
  } = useSelector((state) => state.revision);
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const { defects } = useSelector((state) => state.defect);
  //console.log("defects:", defects.data);
  // console.log("foundDefects:", foundDefects);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(foundDefectsSchema),
    defaultValues: useMemo(() => {
      return { ...foundDefects };
    }, [foundDefects]),
  });
  // if foundDefects data is change reet form
  useEffect(() => {
    if (foundDefects && Object.keys(foundDefects).length) {
      reset({ ...foundDefects });
    } else {
      setValue("minorDefects", ["Bez zjevných závad."]);
      setValue("majorDefects", ["Bez zjevných závad."]);
      if (type == "service") setValue("deviceDefects", ["Bez zjevných závad."]);
    }
  }, [foundDefects]);

  useEffect(()=> {
    if(isFilled) {
      setValue("removeDefectsBefore", moment().add(0.5, "year").toISOString())
    } 
  }, [])

  useEffect(() => {
    dispatch(getDefectsAsyncThunk());
  }, []);
  const onSubmit = (data) => {
    console.log(data);
    dispatch(
      setFoundDefects({
        data: {
          // ...data,
          deviceDefects: data.deviceDefects,
          majorDefects: data.majorDefects,
          minorDefects: data.minorDefects,
          ...(!(type === revisionTypes.service
            ? watch("majorDefects")?.includes("Bez zjevných závad.") &&
            watch("minorDefects")?.includes("Bez zjevných závad.") &&
            watch("deviceDefects")?.includes("Bez zjevných závad.")
            : watch("majorDefects")?.includes("Bez zjevných závad.") &&
            watch("minorDefects")?.includes("Bez zjevných závad.")) && {
            removeDefectsBefore: data.removeDefectsBefore,
          }),
        },
        type,
      })
    );
    handleNext();
  };

  const { handleToggleModal } = useModalContext();

  const majorDefectsOptions = [
    { name: "Bez závad", value: "Bez zjevných závad." },
    { name: "Opravit protikorozní nátěr", value: "Opravit protikorozní nátěr plynovodní instalace - drobná údržba." },
    { name: "Propojit vstup. a výstup. potrubí", value: "Vodivě propojit vstupní a výstupní potrubí vývodů pro plynoměr." },
    { name: "Osadit pevnou plynoměrovou rozpěrku", value: "Osadit pevnou plynoměrovou rozpěrku pro ustavení a vodivé propojení vývodů pro plynoměr." },
    { name: "Promazat kohout K 800 DN 20", value: "Promazat kohout K 800 DN 20 - doporučuji nahradit za kulový kohout." },
    { name: "Promazat kohout K 806 DN 15", value: "Promazat kohout K 806 DN 15 - doporučuji nahradit za kulový kohout." },
    { name: "Promazat kohouty K 800 DN 20 a K 806 DN 15", value: "promazat kohouty K 800 DN 20 a K 806 DN 15 - doporučuji nahradit za kulové kohouty." },
    { name: "Doplnit ovládací klíč kohout 800 DN 15", value: "Doplnit chybějící ovládací klíč ke kohoutu K 800 DN 15." },
    { name: "Doplnit ovládací klíč kohout  800 DN 20", value: "Doplnit chybějící ovládací klíč ke kohoutu K 800 DN 20." },
    { name: "Doplnit ovládací klíč kohout 806 DN 15", value: "Doplnit chybějící ovládací klíč ke kohoutu K 806 DN 15." },
    { name: "Doplnit ovládací klíč kohout 806 DN 15", value: "Doplnit chybějící ovládací klíč ke kohoutu K 806 DN 20." },
    { name: "Odstranit únik plynu ve šroubení plynoměru", value: "odstranit únik plynu ve vstupním a výstupním šroubení plynoměru - provede GridServices (člen Innogy) - nahlásit na linku 123." },
    { name: "Odstranit únik plynu v závitu", value: "Odstranit únik plynu v závitu." },
    { name: "Ukotvit k potrubí za plynoměrem", value: "Řádně ukotvit k pevné konstrukci plynovodní potrubí vedené za plynoměrem v instalační šachtě." },
    { name: "Ukotvit k potrubí u uzávěru", value: "Řádně ukotvit k pevné konstrukci plynovodní potrubí u uzávěru před spotřebičem." },
    { name: "Napojit hadici dopojuj. spotřebič", value: "Hadici dopojující spotřebič napojit dle návodu výrobce a předpisů." },
    { name: "Výměna hadice dopojuj. spotřebič, překročeno 10 let ", value: "Provést výměnu hadice dopojující spotřebič - překročená životnost 10 let." },
    { name: "Výměna hadice dopojuj. spotřebič, požární odolnost", value: "Provést výměnu hadice dopojující spotřebič - životnost 10 let, požární odolnost" },
    { name: "Výměna hadice dopojuj. spotřebič, osadit protipožární", value: "provést výměnu hadice dopojující spotřebič, nebo osadit před hadici protipožární armaturu." },
    { name: "Dopojit spotřebič atest. hadicí", value: "Doporučuji dopojit spotřebič atestovanou hadicí pro lepší přístup a méně spojů." },
    { name: "Zhotovit odvětrávací otvory v kuchyni", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu kuchyně - kontrola - údržba." },
    { name: "Zhotovit odvětrávací otvory v chodbě", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu chodby - kontrola - údržba." },
    { name: "Zhotovit odvětrávací otvory na toaletě", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu toalety - kontrola - údržba." },
    { name: "Zhotovit odvětrávací otvory v koupelně", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu koupelny - kontrola - údržba." },
    { name: "Zhotovit odvětrávací otvory v obývácí místnosti", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu obývací místnosti - kontrola - údržba." },
    { name: "Zpřístupnit potrubí za kuchyň. linkou", value: "Volně zpřístupnit rozebíratelné spoje potrubí vedeného za kuchyňskou linkou - kontrola - údržba." },
    { name: "Zpřístupnit potrubí za vanou", value: "Volně zpřístupnit rozebíratelné spoje potrubí vedeného za vanou - kontrola - údržba." },
    { name: "Zpřístupnit uzávěr před spotřebičem", value: "Volně zpřístupnit uzávěr před spotřebičem - ovládání - kontrola - údržba." },
    { name: "Odvětrat dutý prostor inst. šachty", value: "Odvětrat dutý prostor instalační šachty - zhotovit odvětrací otvory." },

  ].concat(
    defects.data
      .filter((el) => el.type === "majorDefects")
      .map((el) => {
        return { name: el.abbreviatedName, value: el.defectDescription };
      })
  );
  const minorDefectsOptions = [
    { name: "Bez závad", value: "Bez zjevných závad." },
    { name: "Opravit protikorozní nátěr", value: "Opravit protikorozní nátěr plynovodní instalace - drobná údržba" },
    { name: "Propojit vstup. a výstup. potrubí", value: "Vodivě propojit vstupní a výstupní potrubí vývodů pro plynoměr." },
    { name: "Osadit pevnou plynoměrovou rozpěrku", value: "Osadit pevnou plynoměrovou rozpěrku pro ustavení a vodivé propojení vývodů pro plynoměr" },
    { name: "Promazat kohout K 800 DN 20", value: "Promazat kohout K 800 DN 20 - doporučuji nahradit za kulový kohout." },
    { name: "Promazat kohout K 806 DN 15", value: "Promazat kohout K 806 DN 15 - doporučuji nahradit za kulový kohout." },
    { name: "Promazat kohouty K 800 DN 20 a K 806 DN 15", value: "promazat kohouty K 800 DN 20 a K 806 DN 15 - doporučuji nahradit za kulové kohouty." },
    { name: "Doplnit ovládací klíč kohout 800 DN 15", value: "Doplnit chybějící ovládací klíč ke kohoutu K 800 DN 15." },
    { name: "Doplnit ovládací klíč kohout  800 DN 20", value: "Doplnit chybějící ovládací klíč ke kohoutu K 800 DN 20." },
    { name: "Doplnit ovládací klíč kohout 806 DN 15", value: "Doplnit chybějící ovládací klíč ke kohoutu K 806 DN 15." },
    { name: "Doplnit ovládací klíč kohout 806 DN 15", value: "Doplnit chybějící ovládací klíč ke kohoutu K 806 DN 20." },
    { name: "Odstranit únik plynu ve šroubení plynoměru", value: "odstranit únik plynu ve vstupním a výstupním šroubení plynoměru - provede GridServices (člen Innogy) - nahlásit na linku 123." },
    { name: "Odstranit únik plynu v závitu", value: "Odstranit únik plynu v závitu." },
    { name: "Ukotvit k potrubí za plynoměrem", value: "Řádně ukotvit k pevné konstrukci plynovodní potrubí vedené za plynoměrem v instalační šachtě." },
    { name: "Ukotvit k potrubí u uzávěru", value: "Řádně ukotvit k pevné konstrukci plynovodní potrubí u uzávěru před spotřebičem." },
    { name: "Napojit hadici dopojuj. spotřebič", value: "Hadici dopojující spotřebič napojit dle návodu výrobce a předpisů." },
    { name: "Výměna hadice dopojuj. spotřebič, překročeno 10 let ", value: "Provést výměnu hadice dopojující spotřebič - překročená životnost 10 let." },
    { name: "Výměna hadice dopojuj. spotřebič, požární odolnost", value: "Provést výměnu hadice dopojující spotřebič - životnost 10 let - požární odolnost." },
    { name: "Výměna hadice dopojuj. spotřebič, osadit protipožární", value: "provést výměnu hadice dopojující spotřebič, nebo osadit před hadici protipožární armaturu." },
    { name: "Dopojit spotřebič atest. hadicí", value: "Doporučuji dopojit spotřebič atestovanou hadicí pro lepší přístup a méně spojů." },
    { name: "Zhotovit odvětrávací otvory v kuchyni", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu kuchyně - kontrola - údržba." },
    { name: "Zhotovit odvětrávací otvory v chodbě", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu chodby - kontrola - údržba." },
    { name: "Zhotovit odvětrávací otvory na toaletě", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu toalety - kontrola - údržba." },
    { name: "Zhotovit odvětrávací otvory v koupelně", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu koupelny - kontrola - údržba." },
    { name: "Zhotovit odvětrávací otvory v obývácí místnosti", value: "Zhotovit kontrolní a odvětrací otvory ve stropním podhledu obývací místnosti - kontrola, údržba." },
    { name: "Zpřístupnit potrubí za kuchyň. linkou", value: "Volně zpřístupnit rozebíratelné spoje potrubí vedeného za kuchyňskou linkou - kontrola - údržba." },
    { name: "Zpřístupnit potrubí za vanou", value: "Volně zpřístupnit rozebíratelné spoje potrubí vedeného za vanou - kontrola - údržba." },
    { name: "Zpřístupnit uzávěr před spotřebičem", value: "Volně zpřístupnit uzávěr před spotřebičem - ovládání - kontrola - údržba." },
    { name: "Odvětrat dutý prostor inst. šachty", value: "Odvětrat dutý prostor instalační šachty - zhotovit odvětrací otvory." },
  ].concat(
    defects.data
      .filter((el) => el.type === "minorDefects")
      .map((el) => {
        return { name: el.abbreviatedName, value: el.defectDescription };
      })
  );
  const deviceDefectsOptions = [
    { name: "Bez závad", value: "Bez zjevných závad." },
    { name: "Vyčistit a seřídit spotřebič", value: "Celý spotřebič vyčistit a seřídit." },
    { name: "Vyčistit a promazat ovl. kohoutky", value: "vyčistit a promazat ovládací kohoutky spotřebiče." },
    { name: "Vyčistit a promazat ovl. kohoutky", value: "vyčistit a promazat ovládací kohoutky spotřebiče." },
    { name: "Zprovoznit pojistku trouby", value: "Zprovoznit termo-elektrickou pojistku plamene trouby." },
    { name: "Zprovoznit pojistku zadního pravého hořáku", value: "Zprovoznit termo-elektrickou pojistku plamene zadního pravého hořáku." },
    { name: "Zprovoznit pojistku zadního levého hořáku", value: "Zprovoznit termo-elektrickou pojistku plamene zadního levého hořáku." },
    { name: "Zprovoznit pojistku předního pravého hořáku", value: "Zprovoznit termo-elektrickou pojistku plamene předního pravého hořáku." },
    { name: "Zprovoznit pojistku předního levého hořáku", value: "Zprovoznit termo-elektrickou pojistku plamene předního levého hořáku." },
    { name: "Upevnit uvolněný knoflík zadního pravého hořáku", value: "Řádně upevnit uvolněný ovládací knoflík zadního pravého hořáku." },
    { name: "Upevnit uvolněný knoflík zadního levého hořáku", value: "Řádně upevnit uvolněný ovládací knoflík zadního levého hořáku." },
    { name: "Upevnit uvolněný knoflík předního pravého hořáku", value: "Řádně upevnit uvolněný ovládací knoflík předního pravého hořáku." },
    { name: "Upevnit uvolněný knoflík předního levého hořáku", value: "Řádně upevnit uvolněný ovládací knoflík předního levého hořáku." },
    { name: "Zprovoznit piezo-zapalování hořáku", value: "Zprovoznit piezo-zapalování hořáků spotřebiče." },
    { name: "Vypálené rozdělovače plamene", value: "Vypálené rozdělovače plamene - vyměnit." },
    { name: "Doplnit chybějící knoflík předního pravého hořáku", value: "Doplnit chybějící ovládací knoflík předního pravého hořáku." },
    { name: "Doplnit chybějící knoflík předního levého hořáku", value: "Doplnit chybějící ovládací knoflík předního levého hořáku." },
    { name: "Doplnit chybějící knoflík zadního pravého hořáku", value: "Doplnit chybějící ovládací knoflík zadního pravého hořáku." },
    { name: "Doplnit chybějící knoflík zadního levého hořáku", value: "Doplnit chybějící ovládací knoflík zadního levého hořáku." },
    { name: "Vyměnit spotřebič", value: "Vzhledem ke stavu a stáří spotřebiče doporučuji provést jeho výměnu." },


  ].concat(
    defects.data
      .filter((el) => el.type === "deviceDefects")
      .map((el) => {
        return { name: el.abbreviatedName, value: el.defectDescription };
      })
  );

  function isFilled() {
    return type === revisionTypes.service
      ? watch("majorDefects")?.includes(
        "Bez zjevných závad."
      ) &&
      watch("minorDefects")?.includes(
        "Bez zjevných závad."
      ) &&
      watch("deviceDefects")?.includes(
        "Bez zjevných závad."
      )
      : watch("majorDefects")?.includes(
        "Bez zjevných závad."
      ) &&
      watch("minorDefects")?.includes(
        "Bez zjevných závad."
      )
  }
  const haveError = (e) => !!(typeof e === "object" && Object.keys(e));
  return (
    <>
      <Box sx={{ flexGrow: 1 }} component="form" noValidate autoComplete="off">
        <Grid container spacing={{ xs: 3, sm: 7 }}>
          <Grid item xs={12}>
            <Box>
              <Grid container spacing={{ xs: 3, sm: 7 }}>
                <Grid item xs={12}>
                  <GridSection title="Nalezené závady">
                    <Grid item xs={6} md={4}>
                      <ReactHookFormSelect
                        id="majorDefects"
                        {...register("majorDefects", { required: true })}
                        label={errors.majorDefects?.message ?? "Závady bránicí provozu"}
                        name="majorDefects"
                        multiple
                        control={control}
                        error={haveError(errors.majorDefects)}
                        defaultValue={checkArray(
                          watch("majorDefects") || ["Bez zjevných závad."]
                        )}
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "nowrap",
                              gap: 0.5,
                            }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                sx={{
                                  height: "auto",
                                  padding: 0.1,
                                  fontSize: { xs: 8, sm: 12 },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        options={majorDefectsOptions.sort(function (a, b) {
                          if (a.name < b.name) {
                            return -1;
                          }
                          if (a.name > b.name) {
                            return 1;
                          }
                          return 0;
                        })}
                        addnew={
                          <Box sx={{ paddingX: 3 }}>
                            <Button
                              variant="contained"
                              disableElevation
                              sx={{ fontWeight: 500 }}
                              onClick={() => {
                                dispatch(setType({ type: "majorDefects" }));
                                handleToggleModal();
                              }}
                              startIcon={<AddIcon />}
                            >
                              Nová závada
                            </Button>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <ReactHookFormSelect
                        id="minorDefects"
                        {...register("minorDefects", { required: true })}
                        label={errors.minorDefects?.message ?? "Závady nebránicí provozu"}
                        name="minorDefects"
                        error={haveError(errors.minorDefects)}
                        control={control}
                        multiple
                        defaultValue={checkArray(
                          watch("minorDefects") || ["Bez zjevných závad."]
                        )}
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "nowrap",
                              gap: 0.5,
                            }}
                          >
                            {selected.map((name, value) => (
                              <Chip
                                key={value}
                                label={name}
                                sx={{
                                  height: "auto",
                                  padding: 0.1,
                                  fontSize: { xs: 8, sm: 12 },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        fixedTop={true}
                        options={minorDefectsOptions.sort(function (a, b) {
                          if (a.name < b.name) {
                            return -1;
                          }
                          if (a.name > b.name) {
                            return 1;
                          }
                          return 0;
                        })}
                        addnew={
                          <Box sx={{ paddingX: 3 }}>
                            <Button
                              variant="contained"
                              disableElevation
                              sx={{ fontWeight: 500 }}
                              onClick={() => {
                                dispatch(setType({ type: "minorDefects" }));
                                handleToggleModal();
                              }}
                              startIcon={<AddIcon />}
                            >
                              Nová závada
                            </Button>
                          </Box>
                        }
                      />
                    </Grid>
                    {type === revisionTypes.service && (
                      <Grid item xs={6} md={4}>
                        <ReactHookFormSelect
                          id="deviceDefects"
                          {...register("deviceDefects", { required: true })}
                          label={
                            errors.deviceDefects?.message ?? "Závady spotřebiče"
                          }
                          name="deviceDefects"
                          error={haveError(errors.deviceDefects)}
                          control={control}
                          multiple
                          defaultValue={checkArray(
                            watch("deviceDefects") || ["Bez závad"]
                          )}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "nowrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={value}
                                  sx={{
                                    height: "auto",
                                    padding: 0.1,
                                    fontSize: { xs: 8, sm: 12 },
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                          options={deviceDefectsOptions.sort(function (a, b) {
                            if (a.name < b.name) {
                              return -1;
                            }
                            if (a.name > b.name) {
                              return 1;
                            }
                            return 0;
                          })}
                          fixedTop={true}
                          addnew={
                            <Box sx={{ paddingX: 3 }}>
                              <Button
                                variant="contained"
                                disableElevation
                                sx={{ fontWeight: 500 }}
                                onClick={() => {
                                  dispatch(setType({ type: "deviceDefects" }));
                                  handleToggleModal();
                                }}
                                startIcon={<AddIcon />}
                              >
                                Nová závada
                              </Button>
                            </Box>
                          }
                        />
                      </Grid>
                    )}
                  </GridSection>
                </Grid>

                <Grid item xs={12}>
                  <GridSection title="Lhůta k odstranění závad"
                    style={{ color: isFilled() ? theme.palette.secondary.main : theme.palette.text.primary }}>
                    <Grid item xs={6} md={4}>
                      {/*  */}
                      <Controller
                        name={"removeDefectsBefore"}
                        control={control}
                        {...register("removeDefectsBefore", {
                          required: true,
                        })}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
                            <DesktopDatePicker
                              label={mobileScreen ? "Datum" : "Datum k odstranění závad"}
                              control={control}
                              components={{
                                OpenPickerIcon: CalendarIcon
                              }}
                              OpenPickerButtonProps={{style: { color: theme.palette.secondary.primary,
                              marginRight: mobileScreen ? -10 : 1,
                              } }}
                              inputFormat="DD. MM. YYYY"
                              disabled={isFilled()}
                              inputValue=""
                              value={ isFilled() ? null : moment().add(0.5, "year").toISOString()}
                              onChange={(event) => {
                                try {
                                  if (
                                    watch("majorDefects")?.includes(
                                      "Bez závad"
                                    ) &&
                                    watch("minorDefects")?.includes(
                                      "Bez závad"
                                    ) &&
                                    watch("deviceDefects")?.includes(
                                      "Bez závad"
                                    )
                                  )
                                    return;
                                  onChange(event?.toISOString())
                                } catch (error) { }
                              }}
                              renderInput={(params) => (
                                <InputField
                                  {...params}
                                  InputProps={{
                                    ...params?.InputProps,
                                    disableUnderline: true,
                                  }}
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>

                    {/* {type === revisionTypes.service && (
                      <Grid item xs={6} md={4}>
                        <ReactHookFormSelect
                          id="deviceDefects"
                          {...register("deviceDefects", { required: true })}
                          label={
                            errors.deviceDefects?.message ?? "Device defects"
                          }
                          name="deviceDefects"
                          error={haveError(errors.deviceDefects)}
                          control={control}
                          multiple
                          defaultValue={checkArray(
                            watch("deviceDefects") || ["Without Defect"]
                          )}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "nowrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={value}
                                  size={"small"}
                                  sx={{
                                    height: "auto",
                                    padding: 0.1,
                                    fontSize: { xs: 8, sm: 12 },
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                          options={deviceDefectsOptions}
                          fixedTop={true}
                          addnew={
                            <Box sx={{ paddingX: 3 }}>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  dispatch(setType({ type: "deviceDefects" }));
                                  handleToggleModal();
                                }}
                              >
                                Add New
                              </Button>
                            </Box>
                          }
                        />
                      </Grid>
                    )} */}
                  </GridSection>
                </Grid>
              </Grid>
              {/* <Grid item xs={6} md={4}>
                <ReactHookFormSelect
                  id="minorDefects"
                  {...register("minorDefects", { required: true })}
                  label={errors.minorDefects?.message ?? "Minor defects"}
                  name="minorDefects"
                  error={haveError(errors.minorDefects)}
                  control={control}
                  multiple
                  defaultValue={checkArray(
                    watch("minorDefects") || ["Without Defect"]
                  )}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "nowrap",
                        gap: 0.5,
                      }}
                    >
                      {selected.map((value) => (
                        <Chip key={value} label={value} sx={{
                              height: "auto",
                               padding: 0.1,
                              fontSize: { xs: 8, sm: 12 },
                            }} />
                      ))}
                    </Box>
                  )}
                  fixedTop={true}
                  options={minorDefectsOptions}
                  addnew={
                    <Box sx={{ paddingX: 3 }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          dispatch(setType({ type: "minorDefects" }));
                          handleToggleModal();
                        }}
                      >
                        Add New
                      </Button>
                    </Box>
                  }
                />
              </Grid> */}
            </Box>
          </Grid>
          {/* {
            <Grid item xs={12}>
              <GridSection title="Deadline for removal">
                <Grid item xs={6} md={4}>
               
                  <Controller
                    name={"removeDefectsBefore"}
                    control={control}
                    {...register("removeDefectsBefore", {
                      required: true,
                    })}
                    defaultValue={
                      getValues("removeDefectsBefore")
                        ? typeof getValues("removeDefectsBefore") == "object"
                          ? moment(
                              getValues("removeDefectsBefore").seconds * 1000
                            ).toISOString()
                          : moment(
                              getValues("removeDefectsBefore")
                            ).toISOString()
                        : moment().toISOString()
                    }
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label={"Remove Defects Before"}
                          control={control}
                          inputFormat="DD-MM-YYYY"
                          disabled={
                            watch("majorDefects")?.includes("Without Defect") &&
                            watch("minorDefects")?.includes("Without Defect") &&
                            watch("deviceDefects")?.includes("Without Defect")
                          }
                          value={
                            watch("majorDefects")?.includes("Without Defect") &&
                            watch("minorDefects")?.includes("Without Defect") &&
                            watch("deviceDefects")?.includes("Without Defect")
                              ? undefined
                              : value
                          }
                          onChange={(event) => {
                            try {
                              if (
                                watch("majorDefects")?.includes(
                                  "Without Defect"
                                ) &&
                                watch("minorDefects")?.includes(
                                  "Without Defect"
                                ) &&
                                watch("deviceDefects")?.includes(
                                  "Without Defect"
                                )
                              )
                                return;
                              onChange(event?.toISOString());
                            } catch (error) {}
                          }}
                          renderInput={(params) => (
                            <InputField
                              {...params}
                              InputProps={{
                              ...params?.InputProps,
                              disableUnderline: true,
                            }}
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
              </GridSection>
            </Grid>
          } */}
        </Grid>
        <DefectModal />
      </Box>
      <StepButtons
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleSubmit(onSubmit)}
        mobileScreen
      />
    </>
  );
};
