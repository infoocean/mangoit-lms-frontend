// ***** React Import
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
// MUI Import
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, DialogTitleProps, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Table, TableBody, TableHead, TableRow, TextField, Typography, styled } from "@mui/material";
// External Components
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Navbar from "../../../../../common/LayoutNavigations/navbar";
import RichEditor from "@/common/RichTextEditor/textEditor";
// Helper Import
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { courseValidations } from '@/validation_schema/courseValidation';
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from '@/common/CircularProcess/circularProgressBar';
import SpinnerProgress from '@/common/CircularProgressComponent/spinnerComponent';
import { capitalizeFirstLetter } from '@/common/CapitalFirstLetter/capitalizeFirstLetter';
// Types Import
import { courseType } from '@/types/courseType';
// CSS Import
import styles from "../../../../../styles/sidebar.module.css";
import courseStyle from "../../../../../styles/course.module.css";
import { ToastContainer, toast } from 'react-toastify';
// API services
import { HandleCourseGetByID, HandleCourseUpdate } from '@/services/course';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other }: any = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function UpdateCourse() {
  const router: any = useRouter();
  const [getLongDespcriptionContent, setLongDespcriptionContent] = useState("");
  const [getShortDespcriptionContent, setShortDespcriptionContent] = useState("");
  const [getCourse, setCourse] = useState<courseType | any>();
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setErrors] = useState<string>();
  const [imagefile, setImageFile] = useState<string | any>('')
  const [videofile, setVideoFile] = useState<string | any>('')
  const [openCourseTopicBox, setopenCourseTopicBox] = useState(false)
  const [openStudyMaterialBox, setopenStudyMaterialBox] = useState(false)
  const [rowsForCourseTopic, setrowsForCourseTopic] = useState<any>([{}]);
  const [rowsForCourseMaterial, setrowsForCourseMaterial] = useState<any>([{}]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }, setError
  } = useForm<courseType | any>({
    resolver: yupResolver(courseValidations),
  });
  const handleContentChange = (value: string, identifier: string) => {
    if (identifier === 'short_description') {
      if (value === '<p><br></p>') {
        setError(identifier, { message: 'Short Description is a required field' });
      } else {
        setError(identifier, { message: '' })
        setValue(identifier, value);
      }
      setShortDespcriptionContent(value);
    }

    if (identifier === 'long_description') {
      if (value === '<p><br></p>') {
        setError(identifier, { message: 'Long Description is a required field' });
      } else {
        setError(identifier, { message: '' })
        setValue(identifier, value);
      }
      setLongDespcriptionContent(value);
    }

  };
  const onSubmit = async (event: any) => {
    const id = router.query.id
    if (errors.description?.message === '' || (typeof errors === 'object' && errors !== null)) {
      setLoading(true);
      setLoadingButton(false)
      const reqData: any = {
        title: event?.title,
        is_chargeable: event?.is_chargeable,
        long_description: event?.long_description,
        short_description: event?.short_description,
        status: event?.status,
        duration: event?.duration,
        level: event?.level,
        image: event?.image,
        video: event?.video,
        course_learning_topics: JSON.stringify(rowsForCourseTopic),
        Course_learning_material: JSON.stringify(rowsForCourseMaterial)
      }
      const formData = new FormData()
      for (var key in reqData) {
        formData.append(key, reqData[key]);
      }
      try {
        const res = await HandleCourseUpdate(id, formData)
        getCourseData()
        setLoading(false);
        setTimeout(() => {
          router.push('/admin/courses/allcourses/')
        }, 1000)
        setLoadingButton(true)
      } catch (e) {
        console.log(e)
        setLoadingButton(true)
      }
    } else {
      setError('description', { message: 'Description is a required field' });
    }
  };
  const handleUpdate = (e: any) => {
    if (e.target.name === 'title') {
      setCourse({ ...getCourse, title: e.target.value })
    }
  }
  const getCourseData = async () => {
    const id = router.query.id
    if (id) {
      HandleCourseGetByID(id).then((course) => {
        setCourse(course.data)
        setrowsForCourseTopic(JSON.parse(JSON.parse(course.data?.course_learning_topics)))
        setrowsForCourseMaterial(JSON.parse(JSON.parse(course.data?.Course_learning_material)))
        const fields = [
          "title",
          "is_chargeable",
          "status",
          "short_description",
          "long_description",
          "level",
          "duration",
          "image",
          "video"
        ];
        fields.forEach((field) => setValue(field, course.data[field]));
      })
        .catch((error) => {
          setErrors(error.message);
        });
    }

    if (error) {
      return <Typography >{error}</Typography >;
    }
    if (!getCourse) {
      return <Typography >Loading...</Typography >;
    }
  }
  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      getCourseData();
    }
  }, [router.query]);

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (e.target.name === "image") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setImageFile(file);
        //setValue("imageattachment", file);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  const handleVideoChange = (e: any) => {
    const file = e.target.files[0];
    if (e.target.name === "video") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setVideoFile(file);
        // setValue("videoattachment", file);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }
  // //course cover topic edit boxes
  const handleClickOpenCourseTopicBox = () => {
    setopenCourseTopicBox(true);
  };
  const handleCloseCourseTopicBox = () => {
    setopenCourseTopicBox(false);
  };
  // //handle topics row add topic row
  const handleAddTopicRow = () => {
    const item = {};
    setrowsForCourseTopic([...rowsForCourseTopic, item]);
  };
  const ResetTopicRow = () => {
    setrowsForCourseTopic([{}]);
  }
  // //update course topic 
  const updateCourseState = (e: any) => {
    const tempRows = [...rowsForCourseTopic];
    const tempObj = rowsForCourseTopic[e.target.attributes.id.value];
    tempObj[e.target.attributes.id.value] = e.target.value;
    tempRows[e.target.attributes.id.value] = tempObj;
    setrowsForCourseTopic(tempRows);
  };
  // //remove data from array
  const handleRemoveSpecificTopicRow = (idx: number) => {
    if (rowsForCourseTopic.length >= 2) {
      const tempRows = [...rowsForCourseTopic];
      tempRows.splice(idx, 1);
      setrowsForCourseTopic(tempRows);
    } else {
      toast.error("Please add course topics !")
    }
  };
  const courseTopic = () => {
    if (rowsForCourseTopic.length > 0) {
      handleCloseCourseTopicBox();
    } else {
      toast.error("Please add course topics !")
    }
  };
  // //study material boxes
  const handleClickOpenStudyMaterialBox = () => {
    setopenStudyMaterialBox(true);
  };
  const handleCloseStudyMaterialBox = () => {
    setopenStudyMaterialBox(false);
  };
  const handleAddCourseMaterialRow = () => {
    const item = {};
    setrowsForCourseMaterial([...rowsForCourseMaterial, item]);
  };
  const ResetMaterialRow = () => {
    setrowsForCourseMaterial([{}]);
  }
  const updateMaterialState = (e: any) => {
    const tempRows = [...rowsForCourseMaterial];
    const tempObj = rowsForCourseMaterial[e.target.attributes.id.value];
    tempObj[e.target.attributes.id.value] = e.target.value;
    tempRows[e.target.attributes.id.value] = tempObj;
    setrowsForCourseMaterial(tempRows);
  };
  const handleRemoveSpecificMaterialRow = (idx: number) => {
    if (rowsForCourseMaterial.length >= 2) {
      const tempRows = [...rowsForCourseMaterial];
      tempRows.splice(idx, 1);
      setrowsForCourseMaterial(tempRows);
    } else {
      toast.error("Please add course material!")
    }
  }
  const courseMaterial = () => {
    if (rowsForCourseMaterial.length > 0) {
      handleCloseStudyMaterialBox();
    } else {
      toast.error("Please add course material !")
    }
  };

  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="Course"
            Current='Update Course'
            Text="COURSE"
            Link="/admin/courses/allcourses"
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
                    <Grid item xs={12} sm={12} md={12} lg={6} mt={15} >
                      <Box component="img" src="/Images/sideImages/update_section.svg" width={'100%'} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6} >
                      <Typography className={courseStyle.InputLabelFont} mb={1} variant="h5">EDIT COURSE</Typography>
                      <Stack direction="row" spacing={2} mb={2} mt={1}>
                        <Button variant="outlined" id={courseStyle.viewIcon}
                          size="small" onClick={() => handleClickOpenCourseTopicBox()} startIcon={<EditCalendarIcon />}>Edit Learning Topic</Button>
                        <Button variant="outlined" id={courseStyle.viewIcon} size="small" onClick={() => handleClickOpenStudyMaterialBox()} startIcon={<BorderColorIcon />}>Edit Study Material</Button>
                      </Stack>
                      <Grid item xs={12} sm={12} md={12} lg={12} mb={2} >
                        <InputLabel className={courseStyle.InputLabelFont}>
                          Course Name
                        </InputLabel>
                        <TextField fullWidth
                          {...register("title")}
                          value={getCourse?.title}
                          onChange={handleUpdate}
                        />
                        {errors && errors.title
                          ? ErrorShowing(errors?.title?.message)
                          : ""}
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item mb={1} lg={6}>
                          <InputLabel className={styles.InputLabelFont}>
                            Type
                          </InputLabel>
                          <Controller
                            name="is_chargeable"
                            control={control}
                            defaultValue={'free'}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <Select {...field} displayEmpty>
                                  <MenuItem value={'free'}>
                                    Free
                                  </MenuItem>
                                  <MenuItem value={'paid'}>
                                    Paid
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                          {errors && errors.is_chargeable
                            ? ErrorShowing(errors?.is_chargeable?.message)
                            : ""}
                        </Grid>
                        <Grid item mb={1} lg={6}>
                          <InputLabel className={courseStyle.InputLabelFont}>Status</InputLabel>
                          <Controller
                            name="status"
                            control={control}
                            defaultValue={getCourse?.status || ""}
                            // defaultValue=''
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <Select {...field} displayEmpty>
                                  <MenuItem value={'active'}>
                                    Active
                                  </MenuItem>
                                  <MenuItem value={'inactive'}>
                                    In-active
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                          {errors && errors.status
                            ? ErrorShowing(errors?.status?.message)
                            : ""}
                        </Grid>
                        <Grid item mb={1} lg={6}>
                          <InputLabel className={styles.InputLabelFont}>
                            Course Duration
                          </InputLabel>
                          <Controller
                            name="duration"
                            control={control}
                            defaultValue={'three_months'}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <Select {...field} displayEmpty>
                                  <MenuItem value={'three_months'}>
                                    3 Months
                                  </MenuItem>
                                  <MenuItem value={'six_months'}>
                                    6 Months
                                  </MenuItem>
                                  <MenuItem value={'twelve_months'}>
                                    12 Months
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                          {errors && errors.status
                            ? ErrorShowing(errors?.status?.message)
                            : ""}
                        </Grid>
                        <Grid item mb={1} lg={6}>
                          <InputLabel className={styles.InputLabelFont}>
                            Course Level
                          </InputLabel>
                          <Controller
                            name="level"
                            control={control}
                            defaultValue={'basic'}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <Select {...field} displayEmpty>
                                  <MenuItem value={'basic'}>
                                    Basic level
                                  </MenuItem>
                                  <MenuItem value={'intermediate'}>
                                    Intermediate level
                                  </MenuItem>
                                  <MenuItem value={'advanced'}>
                                    Advance level
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                          {errors && errors.status
                            ? ErrorShowing(errors?.status?.message)
                            : ""}
                        </Grid>
                        <Grid item mb={1} lg={12}>
                          <InputLabel className={courseStyle.InputLabelFont}>Image</InputLabel>
                          <Box className={courseStyle.courseAttachmentBox}>
                            <InputLabel className={courseStyle.subbox} >
                              <input
                                type="file"
                                {...register('image')}
                                onChange={handleImageChange}
                                hidden
                              />
                              <Typography className={courseStyle.courseAttachments}>
                                {!imagefile.name ? "Upload" : imagefile.name}
                              </Typography>
                            </InputLabel>
                          </Box>
                          {imagefile ? '' : errors && errors.imagefile ? ErrorShowing(errors?.imagefile?.message) : ""}
                        </Grid>
                        <Grid item mb={1} lg={12}>
                          <InputLabel className={courseStyle.InputLabelFont}>Introduction Video</InputLabel>
                          <Box className={courseStyle.courseAttachmentBox}>
                            <InputLabel className={courseStyle.subbox} >
                              <input
                                type="file"
                                {...register('video')}
                                onChange={handleVideoChange}
                                hidden
                              />
                              <Typography className={courseStyle.courseAttachments}>
                                {!videofile.name ? "Upload" : videofile.name}
                              </Typography>
                            </InputLabel>
                          </Box>
                          {videofile ? '' : errors && errors.videofile ? ErrorShowing(errors?.videofile?.message) : ""}
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} mb={2}>
                        <InputLabel className={courseStyle.InputLabelFont}>Short Description</InputLabel>
                        <Box className={courseStyle.quillDescription1}>
                          <RichEditor
                            {...register("short_description")}
                            value={getShortDespcriptionContent ? getShortDespcriptionContent : getCourse?.short_description}
                            onChange={(value) =>
                              handleContentChange(value, "short_description")
                            }
                          />
                        </Box>
                        {errors && errors.short_description ? ErrorShowing(errors?.short_description?.message) : ""}
                        {/* {getShortDespcriptionContent ? '' : errors && errors.description ? ErrorShowing(errors?.description?.message) : ""} */}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} mb={2} >
                        <InputLabel className={courseStyle.InputLabelFont}>Long Description</InputLabel>
                        <Box className={courseStyle.quillDescription1}>
                          <RichEditor
                            {...register("long_description")}
                            value={getLongDespcriptionContent ? getLongDespcriptionContent : getCourse?.long_description}
                            onChange={(value) =>
                              handleContentChange(value, "long_description")
                            }
                          />
                        </Box>
                        {errors && errors.long_description ? ErrorShowing(errors?.long_description?.message) : ""}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} textAlign={"right"} >
                        <Button className={courseStyle.cancelButton} variant="contained" size="large" onClick={() => router.push('/admin/courses/allcourses')} id={styles.muibuttonBackgroundColor}>Cancel</Button>
                        {!isLoadingButton ? <Button type="submit" size="large" variant="contained" id={styles.muibuttonBackgroundColor}>
                          UPDATE
                        </Button> : <LoadingButton loading={isLoadingButton} className={courseStyle.updateLoadingButton}
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
      {/* dialouge box for add course covered topics */}
      <BootstrapDialog
        onClose={handleCloseCourseTopicBox}
        aria-labelledby="customized-dialog-title"
        open={openCourseTopicBox}
      >
        <BootstrapDialogTitle id="customized-dialog-title"
          //onClose={handleCloseCourseTopicBox}
          variant="h6" sx={{ fontWeight: "bold" }}>
          Add course topics what you&apos;ll covered in this course
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid item mb={2}>
            <Stack direction="row" sx={{ display: "flex", justifyContent: "end" }} spacing={2}>
              <Button variant="outlined" size="small" onClick={ResetTopicRow} startIcon={<RestartAltOutlinedIcon />}>Reset</Button>
              <Button variant="outlined" size="small" onClick={handleAddTopicRow} startIcon={<AddIcon />}>Add New</Button>
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  <Stack direction="row" >
                    <InputLabel className={styles.InputLabelFont} sx={{ marginBottom: "5px" }}>
                      Topic Name
                    </InputLabel>
                  </Stack>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {rowsForCourseTopic.map((item: any, idx: any) => (
                    <Stack key={idx} direction="row" spacing={2} mb={1} mt={1}>
                      <TextField
                        id={idx}
                        value={item[idx]}
                        placeholder="Topic Name ...."
                        fullWidth
                        size="small"
                        onChange={(e) => updateCourseState(e)}
                      />
                      <Button variant="outlined" onClick={() => handleRemoveSpecificTopicRow(idx)}><DeleteIcon /></Button>
                    </Stack>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} mb={2} mt={1}>
            <Button
              type="button"
              size="large"
              variant="contained"
              onClick={handleCloseCourseTopicBox}
              id={styles.muibuttonBackgroundColor}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="large"
              variant="contained"
              id={styles.muibuttonBackgroundColor}
              onClick={courseTopic}
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
      {/* dialouge box for add study material */}
      <BootstrapDialog
        onClose={handleCloseStudyMaterialBox}
        aria-labelledby="customized-dialog-title"
        open={openStudyMaterialBox}
      >
        <BootstrapDialogTitle id="customized-dialog-title"
          //onClose={handleCloseCourseTopicBox}
          variant="h6" sx={{ fontWeight: "bold" }}>
          Add study material what you&apos;ll provide in this course
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid item mb={2}>
            <Stack direction="row" sx={{ display: "flex", justifyContent: "end" }} spacing={2}>
              <Button variant="outlined" size="small" onClick={ResetMaterialRow} startIcon={<RestartAltOutlinedIcon />}>Reset</Button>
              <Button variant="outlined" size="small" onClick={handleAddCourseMaterialRow} startIcon={<AddIcon />}>Add New </Button>
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  <Stack direction="row" >
                    <InputLabel className={styles.InputLabelFont} sx={{ marginBottom: "5px" }}>
                      Material Name
                    </InputLabel>
                  </Stack>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {rowsForCourseMaterial.map((item: any, idx: any) => (
                    <Stack key={idx} direction="row" spacing={2} mb={1} mt={1}>
                      <TextField
                        id={idx}
                        value={item[idx]}
                        placeholder="Material Name ...."
                        fullWidth
                        size="small"
                        onChange={(e) => updateMaterialState(e)}
                      />
                      <Button variant="outlined" onClick={() => handleRemoveSpecificMaterialRow(idx)}><DeleteIcon /></Button>
                    </Stack>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} mb={2} mt={1}>
            <Button
              type="button"
              size="large"
              variant="contained"
              onClick={handleCloseStudyMaterialBox}
              id={styles.muibuttonBackgroundColor}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="large"
              variant="contained"
              id={styles.muibuttonBackgroundColor}
              onClick={courseMaterial}
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
      {/* <Footer/> */}
      <ToastContainer />
    </>
  );
};


