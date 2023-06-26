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
import { moduleValidations } from '@/validation_schema/moduleValidation';
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from '@/common/CircularProcess/circularProgressBar';
import SpinnerProgress from '@/common/CircularProgressComponent/spinnerComponent';
// Types Import
import { courseType } from '@/types/courseType';
import { moduleType } from '@/types/moduleType';
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import ModuleCss from "../../../../styles/modules.module.css"
import { ToastContainer } from 'react-toastify';
// API services
import { HandleCourseGet } from '@/services/course';
import { HandleModuleCreate } from '@/services/module';


export default function AddSession() {
   const router: any = useRouter();
   const [despcriptionContent, setdespcriptionContent] = useState("");
   const [getCourses, setCourses] = useState<courseType | any>();
   const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
   const [isLoading, setLoading] = useState<boolean>(false);
   const [getCourseId, setCourseId] = React.useState<any>(0);

   const {
      register,
      handleSubmit,
      reset,
      setValue,
      control,
      formState: { errors },
   } = useForm<moduleType | any>({
      resolver: yupResolver(moduleValidations),
   });

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

   const handleContentChange = (value: string, identifier: string) => {
      setdespcriptionContent(value);
      setValue(identifier, value);

   };

   const onSubmit = async (event: any) => {
      setLoadingButton(true)
      try {
         const res = await HandleModuleCreate({ ...event, course_id: getCourseId })
         setTimeout(() => {
            router.push('/admin/courses/allmodules/')
         },1000)
         setLoadingButton(false)
      } catch (e) {
         console.log(e)
         setLoadingButton(false)
      }
   };

   const getCourseData = () => {
      HandleCourseGet('', '').then((courses) => {
         setCourses(courses.data)
      })
   };



   function ErrorShowing(errorMessage: any) {
      return (
         <Typography variant="body2" color={"error"} gutterBottom>
            {errorMessage}{" "}
         </Typography>
      );
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
                  Middle="Module"
                  Current='Add Module'
                  Text="MODULE"
                  Link="/admin/courses/allmodules"
               />
               {/* main content */}
               <Card>
                  <CardContent sx={{padding:'0px !important'}}>
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
                                 <Box component="img" src="/Images/sideImages/add_section.svg" width={'100%'} height={'568px'} />
                              </Grid>

                              <Grid item xs={12} sm={12} md={12} lg={6} mt={6} p={3}>
                                 <Typography className={ModuleCss.InputLabelFont} mb={1}>ADD MODULE</Typography>
                                 <Grid item xs={12} sm={12} md={12} lg={12} className={ModuleCss.sessionNameGride} mt={5}>

                                    <Grid item xs={12} sm={12} md={6} lg={6} >
                                       <InputLabel className={ModuleCss.InputLabelFont}>
                                          Module Name
                                       </InputLabel>
                                       <TextField
                                          placeholder="Module Name"
                                          {...register("title")}
                                          className={ModuleCss.inputFieldWidth}
                                       />
                                       {errors && errors.title
                                          ? ErrorShowing(errors?.title?.message)
                                          : ""}
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                       <InputLabel className={ModuleCss.InputLabelFont}>Course of Module</InputLabel>
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
                                          }}
                                       />

                                       {errors && errors.course_id
                                          ? ErrorShowing(errors?.course_id?.message)
                                          : ""}
                                    </Grid>
                                 </Grid>

                                 <Grid item xs={12} sm={12} md={12} lg={12} mb={2} >
                                    <InputLabel className={ModuleCss.InputLabelFont}>Status</InputLabel>
                                    <Controller
                                       name="status"
                                       control={control}
                                       defaultValue=""
                                       render={({ field }) => (
                                          <FormControl fullWidth>
                                             <Select {...field} displayEmpty>
                                                <MenuItem disabled value="">
                                                   Status
                                                </MenuItem>
                                                <MenuItem value={'active'} >
                                                   Active
                                                </MenuItem>
                                                <MenuItem value={'inactive'}>
                                                   Inactive
                                                </MenuItem>
                                             </Select>
                                          </FormControl>
                                       )}
                                    />
                                    {errors && errors.status ? ErrorShowing(errors?.status?.message) : ""}
                                 </Grid>

                                 <Grid item xs={12} sm={12} md={12} lg={12} mb={2} >
                                    <InputLabel className={ModuleCss.InputLabelFont}>Description</InputLabel>
                                    <Box className={ModuleCss.quillDescription}>
                                    <RichEditor
                                       {...register("description")}
                                       value={despcriptionContent}
                                       onChange={(e) =>
                                          handleContentChange(e, "description")
                                       }
                                    />
                                    </Box>
                                    {errors && errors.description ? ErrorShowing(errors?.description?.message) : ""}
                                 </Grid>


                                 <Grid item xs={12} sm={12} md={12} lg={12} textAlign={"right"} >
                                    <Button className={ModuleCss.cancelButton} variant="contained" size="large" onClick={() => router.push('/admin/courses/allmodules')} id={styles.muibuttonBackgroundColor}>Cancel</Button>
                                    {!isLoadingButton ? <Button type="submit" size="large" variant="contained" id={styles.muibuttonBackgroundColor}>
                                       Submit
                                    </Button> : <LoadingButton loading={isLoadingButton} className={ModuleCss.updateLoadingButton}
                                       size="large" variant="contained" disabled >
                                       <CircularProgressBar />
                                    </LoadingButton>}
                                 </Grid>
                              </Grid>

                           </Grid>
                        </Box>:<SpinnerProgress/>}
                  </CardContent>
               </Card>
            </Box>
         </Box>
         {/* <Footer/> */}
         <ToastContainer />
      </>
   );
};


