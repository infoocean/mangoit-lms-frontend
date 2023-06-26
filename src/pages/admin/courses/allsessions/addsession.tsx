// ***** React Import
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
// MUI Import
import { Autocomplete, Box, Button, Card, CardContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
// External Components
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import Navbar from "../../../../common/LayoutNavigations/navbar";
import RichEditor from "@/common/RichTextEditor/textEditor";
// Helper Import
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sessionValidations } from '@/validation_schema/sessionValidation';
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from '@/common/CircularProcess/circularProgressBar';
import SpinnerProgress from '@/common/CircularProgressComponent/spinnerComponent';
// Types Import
import { sessionType } from '@/types/sessionType';
import { courseType } from '@/types/courseType';
import { moduleType } from '@/types/moduleType';
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import Sessions from "../../../../styles/session.module.css"
import { ToastContainer } from 'react-toastify';
// API services
import { HandleCourseGet } from '@/services/course';
import { HandleModuleGet } from '@/services/module';
import { HandleSessionCreate } from '@/services/session';

export default function AddSession() {

  const router: any = useRouter();
  const [despcriptionContent, setdespcriptionContent] = useState("");
  const [getCourses, setCourses] = useState<courseType | any>();
  const [getSession, setSession] = useState<sessionType | any>();
  const [getModules, setModules] = useState<moduleType | any>();
  const [getCourseId, setCourseId] = React.useState<any>(0);
  const [getModuleId, setModuleId] = React.useState<any>(0);
  const [file, setFile] = useState<string | any>('')
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }, setError
  } = useForm<sessionType | any>({
    resolver: yupResolver(sessionValidations),
  });

  const handleContentChange = (value: any, identifier: string) => {
    if (value === '<p><br></p>') {
      setError(identifier, { message: 'Description is a required field' });
      setValue(identifier, '');
    } else {
      setError(identifier, { message: '' })
      setValue(identifier, value);
    }
    setdespcriptionContent(value);
  };

  const onSubmit = async (event: any) => {
    if (errors.description?.message === '') {
      const reqData: any = {
        description: event.description,
        module_id: getModuleId,
        course_id: getCourseId,
        title: event.title,
        attachment: file
      }
      const formData = new FormData()
      for (var key in reqData) {
        formData.append(key, reqData[key]);
      }
      setLoadingButton(true)
      try {
        const res = await HandleSessionCreate(formData)
        setSession(res.data)
        setTimeout(() => {
          router.push('/admin/courses/allsessions/')
        },1000) 
        setLoadingButton(true)  
      }
      catch (e) {
        console.log(e)
        setLoadingButton(true)
      }
    } else {
      setError('description', { message: 'Description is a required field' });
    }
  };

  const getCourseData = () => {
    HandleCourseGet('', '').then((courses) => {
      setCourses(courses.data)
    })

  };

  const getModuleData = (courseId:any) => {
    HandleModuleGet('', '').then((modules) => {
      const findModuleAccToCourse = modules.data.filter((ress:any)=>{
        return (
          ress.module.course_id === courseId
        )
      })
      setModules(findModuleAccToCourse)
    })
  }

  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      const userId = JSON.parse(localData);
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
         }
         if (file) {
            reader.readAsDataURL(file);
         }
      }
   }

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
                  Current='Add Session'
                  Text="SESSION"
                  Link="/admin/courses/allsessions"
               />
               {/* main content */}
               <Card>
                  <CardContent>
                        <Box
                           component="form"
                           method="POST"
                           noValidate
                           autoComplete="off"
                           onSubmit={handleSubmit(onSubmit)}
                           onReset={reset}
                        >
                           <Grid container spacing={2}>
                              <Grid item xs={12} sm={12} md={12} lg={6} mt={5}>
                                 <Box component="img" src="/Images/sideImages/add_section.svg" width={'100%'} />
                              </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={6} >
                      <Typography className={Sessions.InputLabelFont} mb={1}>ADD SESSION</Typography>
                      <Grid item xs={12} sm={12} md={12} lg={12} className={Sessions.sessionNameGride} >

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <InputLabel className={Sessions.InputLabelFont}>
                            Session Name
                          </InputLabel>
                          <TextField
                            placeholder="Session Name"
                            {...register("title")}
                            className={Sessions.inputFieldWidth}

                       
                          />
                          {errors && errors.title
                            ? ErrorShowing(errors?.title?.message)
                            : ""}
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <InputLabel className={Sessions.InputLabelFont}>Course of session</InputLabel>
                          <Autocomplete
                            id="combo-box-demo"
                            options={getCourses}
                            getOptionLabel={(option: any) =>
                              option?.course?.title
                            }
                            renderInput={(params) => (
                              <TextField
                                {...register("course_id")}
                                {...params}
                                placeholder="Select Course"
                              />
                            )}
                            onChange={(event, newValue) => {
                              setCourseId(newValue?.course?.id);
                              getModuleData(newValue?.course?.id)
                            }}
                          />
                          {errors && errors.course_id
                            ? ErrorShowing(errors?.course_id?.message)
                            : ""}
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={12} mb={2} >
                        <InputLabel className={Sessions.InputLabelFont}>Module of session</InputLabel>
                        <Autocomplete
                          id="combo-box-demo"
                          options={getModules}
                          getOptionLabel={(option: any) =>
                            option?.module?.title
                          }
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
                        {errors && errors.module_id ? ErrorShowing(errors?.module_id?.message) : ""}
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={12} mb={2}>
                        <InputLabel className={Sessions.InputLabelFont}>Description</InputLabel>
                        <Box className={Sessions.quillDescription}>
                        <RichEditor
                          {...register("description")}
                          value={despcriptionContent}
                          onChange={(e) =>
                            handleContentChange(e, "description")
                          }
                        />
                        </Box>
                        {errors && errors.description ? ErrorShowing(errors?.description?.message) : ""}
                        {/* {despcriptionContent ? '' : errors && errors.description ? ErrorShowing(errors?.description?.message) : ""} */}
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={12} mb={2}>
                        <InputLabel className={Sessions.InputLabelFont}>Attachment</InputLabel>
                        <Box className={Sessions.sessionAttachmentBox}>
                          <InputLabel className={Sessions.subbox} >
                            <input
                              type="file"
                              {...register('attachment')}
                              onChange={handleChange}
                              hidden
                            />
                            <Typography className={Sessions.sessionAttachments}>  {!file.name ? "Upload" : file.name}</Typography>
                          </InputLabel>
                        </Box>
                        {file ? '' : errors && errors.file ? ErrorShowing(errors?.file?.message) : ""}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} textAlign={"right"} >
                        <Button className={Sessions.cancelButton} variant="contained" size="large" onClick={() => router.push('/admin/courses/allsessions')} id={styles.muibuttonBackgroundColor}>Cancel</Button>
                        {!isLoadingButton ? <Button type="submit" size="large" variant="contained" id={styles.muibuttonBackgroundColor}>
                          Submit
                        </Button> : <LoadingButton loading={isLoadingButton} className={Sessions.updateLoadingButton}
                          size="large" variant="contained" disabled >
                          <CircularProgressBar />
                        </LoadingButton>}
                      </Grid>
                    </Grid>

                  </Grid>
                </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      {/* <Footer/> */}
      <ToastContainer />
    </>
  );
};


