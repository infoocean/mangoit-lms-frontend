// ***** React Import
import 'regenerator-runtime/runtime'
import React, { useState, useEffect, createContext, useMemo, useContext } from "react";
import { useRouter } from "next/router";
// MUI Import
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
// External Components
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import Navbar from "../../../../common/LayoutNavigations/navbar";
import RichEditor from "@/common/RichTextEditor/textEditor";
// Helper Import
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sessionValidations } from "@/validation_schema/sessionValidation";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
// Types Import
import { sessionType } from "@/types/sessionType";
import { courseType } from "@/types/courseType";
import { moduleType } from "@/types/moduleType";
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import Sessions from "../../../../styles/session.module.css";
import { ToastContainer } from "react-toastify";
// API services
import { HandleCourseGet } from "@/services/course";
import { HandleModuleGet } from "@/services/module";
import { HandleSessionCreate } from "@/services/session";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import { HandleAIText, aiBtnCss } from "@/services/text_AI";
import { HandleSiteGetByID } from "@/services/site";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';

import SpeechRecogize from '@/common/SpeechRecognisation/speechRecogize';
import moment from 'moment';
export const speechContext: any = createContext('');

const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');
const todayStartOfTheDay = today.startOf('day');

export default function AddSession() {
  const router: any = useRouter();
  const [despcriptionContent, setdespcriptionContent] = useState("");
  const [getCourses, setCourses] = useState<courseType | any>();
  const [getSession, setSession] = useState<sessionType | any>();
  const [getModules, setModules] = useState<moduleType | any>();
  const [getCourseId, setCourseId] = React.useState<any>(0);
  const [getModuleId, setModuleId] = React.useState<any>(0);
  const [file, setFile] = useState<string | any>("");
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [aiLoader, setAiLoader] = useState<any>(false);
  const [siteKey, setSiteKey] = useState(false);
  const [secretKey, setSecretKey] = useState<any>("");
  // const [toogle, setToogle] = useState<boolean>(false)
  const [transcript, setTranscript] = useState('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [liveDate, setLiveDate] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
    setError,
  } = useForm<sessionType | any>({
    resolver: yupResolver(sessionValidations),
  });



  const handleContentChange = (value: any, identifier: string) => {
    if (value === "<p><br></p>") {
      setError(identifier, { message: "Description is a required field" });
      setValue(identifier, "");
    } else {
      setError(identifier, { message: "" });
      setValue(identifier, value);
    }
    setdespcriptionContent(value);
  };

  const onSubmit = async (event: any) => {
    if (errors.description?.message === "") {
      const reqData: any = {
        description: event.description,
        module_id: getModuleId,
        course_id: getCourseId,
        title: event.title,
        attachment: file,
        live_date: moment(liveDate).format("YYYY-MM-DD HH:mm:ss"),
      };
      const formData = new FormData();
      for (var key in reqData) {
        formData.append(key, reqData[key]);
      }
      setLoadingButton(true);
      try {
        const res = await HandleSessionCreate(formData);
        setSession(res.data);
        setTimeout(() => {
          router.push("/admin/courses/allsessions/");
        }, 1000);
        setLoadingButton(true);
      } catch (e) {
        console.log(e);
        setLoadingButton(true);
      }
    } else {
      setError("description", { message: "Description is a required field" });
    }
  };

  const getCourseData = () => {
    HandleCourseGet("", "").then((courses) => {
      setCourses(courses.data);
    });
  };

  const getModuleData = (courseId: any) => {
    HandleModuleGet("", "").then((modules) => {
      const findModuleAccToCourse = modules.data.filter((ress: any) => {
        return ress.module.course_id === courseId;
      });
      setModules(findModuleAccToCourse);
    });
  };

  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      const user_id = JSON.parse(localData);
      HandleSiteGetData(user_id?.id);
      getCourseData();
    }
  }, []);

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    if (e.target.name === "attachment") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setFile(file);
        setValue("file", file);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const generateShortDescription = async () => {
    try {
      setAiLoader(true);
      await HandleAIText(title, secretKey).then((data) => {
        // let shortDesc = data?.substring(0, 400);
        setdespcriptionContent(data);
        setAiLoader(false);
      });
    } catch (e) {
      setAiLoader(false);
      console.log(e);
    }
  };


  const HandleSiteGetData = async (userId: any) => {
    await HandleSiteGetByID(userId)
      .then((res) => {
        const getSiteData = res.data.filter(
          (item: any) => item.key === "content_sk" && item.is_deleted === true
        );
        if (getSiteData?.length === 0) {
          setSiteKey(false);
        } else {
          setSiteKey(true);
          setSecretKey(getSiteData[0]?.value);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeCheckBox = () => {
    if (isChecked === false) { setIsChecked(true) }
    if (isChecked === true) { setIsChecked(false) }
  }

  const handleDateSelect = (e: any) => {
    setLiveDate(e?.$d)
    // console.log(e?.$d);

  }
  // console.log(transcript);
  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />
        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="Session"
            Current="Add Session"
            Text="SESSION"
            Link="admin/courses/allsessions"
          />
          {/* main content */}

          <Card >
            <CardContent>
              <Box
                component="form"
                method="POST"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                onReset={reset}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={12} lg={12} mt={1} mb={2}>
                    <Typography className={styles.headingTitle}>
                      ADD SESSION
                    </Typography>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={Sessions.InputLabelFont}>
                      Session Name
                    </InputLabel>
                    <TextField
                      placeholder="Session Name"
                      {...register("title")}
                      onChange={(e: any) => setTitle(e.target.value)}
                      className={Sessions.inputFieldWidth}
                    />
                    {errors && errors.title
                      ? ErrorShowing(errors?.title?.message)
                      : ""}
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={Sessions.InputLabelFont}>
                      Course of session
                    </InputLabel>
                    <Autocomplete
                      id="combo-box-demo"
                      options={getCourses}
                      getOptionLabel={(option: any) => option?.course?.title}
                      renderInput={(params) => (
                        <TextField
                          {...register("course_id")}
                          {...params}
                          placeholder="Select Course"
                        />
                      )}
                      onChange={(event, newValue) => {
                        setCourseId(newValue?.course?.id);
                        getModuleData(newValue?.course?.id);
                      }}
                    />
                    {errors && errors.course_id
                      ? ErrorShowing(errors?.course_id?.message)
                      : ""}
                  </Grid>
                  {/* </Grid> */}

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={Sessions.InputLabelFont}>
                      Module of session
                    </InputLabel>
                    <Autocomplete
                      id="combo-box-demo"
                      options={getModules}
                      getOptionLabel={(option: any) => option?.module?.title}
                      renderInput={(params) => (
                        <TextField
                          {...register("module_id")}
                          {...params}
                          placeholder="Select Module"
                        />
                      )}
                      onChange={(event, newValue) => {
                        setModuleId(newValue?.module?.id);
                      }}
                    />
                    {errors && errors.module_id
                      ? ErrorShowing(errors?.module_id?.message)
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={Sessions.InputLabelFont}>
                      Attachment
                    </InputLabel>
                    <Box className={Sessions.sessionAttachmentBox}>
                      <InputLabel className={Sessions.subbox}>
                        <input
                          type="file"
                          {...register("attachment")}
                          onChange={handleChange}
                          hidden
                        />
                        <Typography className={Sessions.sessionAttachments}>
                          {" "}
                          {!file.name ? "Upload" : file.name}
                        </Typography>
                      </InputLabel>
                    </Box>
                    {file
                      ? ""
                      : errors && errors.file
                        ? ErrorShowing(errors?.file?.message)
                        : ""}
                  </Grid>
                  <speechContext.Provider value={{ setTranscript }}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box className={styles.aiCss}>
                        <InputLabel className={Sessions.InputLabelFont}>
                          Description
                        </InputLabel>
                        {title && title !== null && siteKey === true ? (
                          <Button
                            variant="text"
                            className={styles.aiButton}
                            onClick={generateShortDescription}
                          >
                            {aiLoader ? (
                              <AutorenewIcon sx={aiBtnCss} />
                            ) : (
                              <AutorenewIcon />
                            )}{" "}
                            &nbsp;Auto Generate
                          </Button>

                        ) : (
                          ""
                        )}

                        {title && title !== null && siteKey === true ? (
                          <SpeechRecogize />

                        ) : (
                          ""
                        )}
                      </Box>
                      <RichEditor
                        {...register("description")}
                        value={transcript ? transcript : despcriptionContent}
                        onChange={(e) => handleContentChange(e, "description")}
                        className={Sessions.quillDescription}
                      />
                      {errors && errors.description
                        ? ErrorShowing(errors?.description?.message)
                        : ""}
                      {/* {despcriptionContent ? '' : errors && errors.description ? ErrorShowing(errors?.description?.message) : ""} */}
                    </Grid>
                  </speechContext.Provider>


                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <FormControlLabel
                      control={<Checkbox
                        onChange={handleChangeCheckBox}
                      />}
                      label="Is this is live stream session"
                    />
                  </Grid>

                  {isChecked ?
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoItem label="Set streaming Date">
                            <DateTimePicker
                              {...register("live_date")}
                              defaultValue={today}
                              onChange={(e) => handleDateSelect(e)}                       
                              disablePast
                              views={['year', 'month', 'day', 'hours', 'minutes']}
                            />
                          </DemoItem>
                        </LocalizationProvider>
                      </Grid>
                    </Grid>
                    : ''}

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    textAlign={"right"}
                  >
                    <Button
                      className={Sessions.cancelButton}
                      variant="contained"
                      size="large"
                      onClick={() => router.push("/admin/courses/allsessions")}
                      id={styles.muibuttonBackgroundColor}
                    >
                      Cancel
                    </Button>
                    {!isLoadingButton ? (
                      <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        id={styles.muibuttonBackgroundColor}
                      >
                        Submit
                      </Button>
                    ) : (
                      <LoadingButton
                        loading={isLoadingButton}
                        className={Sessions.updateLoadingButton}
                        size="large"
                        variant="contained"
                        disabled
                      >
                        <CircularProgressBar />
                      </LoadingButton>
                    )}
                    {/* </Grid> */}
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card >

        </Box >
      </Box >
      <Footer />
      <ToastContainer />
    </>
  );
}
