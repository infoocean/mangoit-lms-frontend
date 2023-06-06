// ***** React Import
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
// MUI Import
import { Box, Button, Card, CardContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
// External Components
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import Navbar from "../../../common/LayoutNavigations/navbar";
import RichEditor from "@/common/RichTextEditor/textEditor";
// Helper Import
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sessionValidations } from '@/validation_schema/sessionValidation';
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from '@/common/CircularProcess/circularProgressBar';
import SpinnerProgress from '@/common/CircularProgressComponent/spinnerComponent';
import { capitalizeFirstLetter } from '@/common/CapitalFirstLetter/capitalizeFirstLetter';
// Types Import
import { sessionType } from '@/types/sessionType';
import { courseType } from '@/types/courseType';
import { moduleType } from '@/types/moduleType';
// CSS Import
import styles from "../../../styles/sidebar.module.css";
import Sessions from "../../../styles/session.module.css"
import { ToastContainer } from 'react-toastify';
// API services
import { HandleCourseGet } from '@/services/course';
import { HandleModuleGet } from '@/services/module';
import { HandleSessionCreate } from '@/services/session';

export default function AddSubscription() {

   const router: any = useRouter();
   const [despcriptionContent, setdespcriptionContent] = useState("");
   const [getCourses, setCourses] = useState<courseType | any>();
   const [getSession, setSession] = useState<sessionType | any>();
   const [getModules, setModules] = useState<moduleType | any>();
   const [file, setFile] = useState<string | any>('')
   const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
   const [isLoading, setLoading] = useState<boolean>(false);

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
      // console.log(value, "identifier", identifier, value === '<p><br></p>', value === `<p><br></p>`)
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
            module_id: event.module_id,
            course_id: event.course_id,
            title: event.title,
            attachment: file
         }

         const formData = new FormData()
         for (var key in reqData) {
            formData.append(key, reqData[key]);
         }

         setLoading(true);
         setLoadingButton(false)
         try {
            const res = await HandleSessionCreate(formData)
            setSession(res.data)
            setLoading(false);
            setTimeout(() => {
               router.push('/admin/courses/allsessions/')
            }, 1000)
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

   const getModuleData = () => {
      HandleModuleGet('', '').then((modules) => {
         setModules(modules.data)
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
         getModuleData();
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

   // console.log("oopps", errors)
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
                  Text="SESSION"
                  Link="/admin/courses/allsessions"
               />
               {/* main content */}
               <Card>
                  <CardContent>
                     {!isLoading ?
                        <Box
                           component="form"
                           method="POST"
                           noValidate
                           autoComplete="off"
                           onSubmit={handleSubmit(onSubmit)}
                           onReset={reset}
                        >
                           <Grid container spacing={2}>
                              <Grid item xs={12} sm={12} md={12} lg={6} >
                                 <Box component="img" src="/Images/pages/addFeature.jpg" width={'100%'} />
                              </Grid>

                              <Grid item xs={12} sm={12} md={12} lg={6} >
                                 <Typography className={Sessions.InputLabelFont} mb={1}>ADD SESSION</Typography>
                                 <Grid item xs={12} sm={12} md={12} lg={12} >

                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                       <InputLabel className={Sessions.InputLabelFont}>
                                          Subscription Name
                                       </InputLabel>
                                       <TextField
                                          placeholder="Subscription Name"
                                          {...register("title")}
                                       />
                                       {errors && errors.title
                                          ? ErrorShowing(errors?.title?.message)
                                          : ""}
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                       <InputLabel className={Sessions.InputLabelFont}>
                                          Price
                                       </InputLabel>
                                       <TextField
                                          placeholder="Price"
                                          {...register("title")}
                                       />
                                       {errors && errors.title
                                          ? ErrorShowing(errors?.title?.message)
                                          : ""}
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                       <InputLabel className={Sessions.InputLabelFont}>
                                          Duration
                                       </InputLabel>
                                       <TextField
                                       type='date'
                                          placeholder="Duration Date"
                                          {...register("title")}
                                       />
                                       {errors && errors.title
                                          ? ErrorShowing(errors?.title?.message)
                                          : ""}
                                    </Grid>
                                 </Grid>

                                 <Grid item xs={12} sm={12} md={12} lg={12} mb={2} >
                                    <InputLabel className={Sessions.InputLabelFont}>Module of session</InputLabel>
                                    <Controller
                                       name="module_id"
                                       control={control}
                                       defaultValue=""
                                       render={({ field }) => (
                                          <FormControl fullWidth>
                                             <Select {...field} displayEmpty>
                                                <MenuItem value={'active'}>Active</MenuItem>
                                                <MenuItem value={'active'}>Inactive</MenuItem>
                                               
                                             </Select>
                                          </FormControl>
                                       )}
                                    />
                                    {errors && errors.module_id ? ErrorShowing(errors?.module_id?.message) : ""}
                                 </Grid>

                                 <Grid item xs={12} sm={12} md={12} lg={12} mb={2}>
                                    <InputLabel className={Sessions.InputLabelFont}>Description</InputLabel>
                                    <RichEditor
                                       {...register("description")}
                                       value={despcriptionContent}
                                       onChange={(e) =>
                                          handleContentChange(e, "description")
                                       }
                                    />
                                    {errors && errors.description ? ErrorShowing(errors?.description?.message) : ""}
                                    {/* {despcriptionContent ? '' : errors && errors.description ? ErrorShowing(errors?.description?.message) : ""} */}
                                 </Grid>

                               
                                 <Grid item xs={12} sm={12} md={12} lg={12} textAlign={"right"} >
                                    <Button className={Sessions.cancelButton} variant="contained" size="large" onClick={() => router.push('/admin/courses/allsessions')} >Cancel</Button>
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
                        : <SpinnerProgress />}
                  </CardContent>
               </Card>
            </Box>
         </Box>
         {/* <Footer/> */}
         <ToastContainer />
      </>
   );
};


