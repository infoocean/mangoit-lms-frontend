import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import SidebarStyles from "../../../../styles/sidebar.module.css";
import styles from "../../../../styles/course.module.css";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogTitleProps,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
// CSS Import
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import RichEditor from "@/common/RichTextEditor/textEditor";
import { Controller, useForm } from "react-hook-form";
import { courseType } from "@/types/courseType";
import { yupResolver } from "@hookform/resolvers/yup";
import { courseValidations } from "@/validation_schema/courseValidation";
import { HandleCourseCreate } from "@/services/course";
import { useRouter } from "next/router";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import { LoadingButton } from "@mui/lab";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";

import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
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

const AddCourse = () => {
  const [shortDespcriptionContent, setShortDespcriptionContent] = useState("");
  const [despcriptionContent, setdespcriptionContent] = useState("");
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const router: any = useRouter();
  const [imagefile, setImageFile] = useState<string | any>('')
  const [videofile, setVideoFile] = useState<string | any>('')
  const [openCourseTopicBox, setopenCourseTopicBox] = useState(false)
  const [openStudyMaterialBox, setopenStudyMaterialBox] = useState(false)
  const [rowsForCourseTopic, setrowsForCourseTopic] = useState<any>([{}]);
  const [rowsForCourseMaterial, setrowsForCourseMaterial] = useState<any>([{}]);


  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }, setError
  } = useForm<courseType | any>({
    resolver: yupResolver(courseValidations),
  });

  const handleContentChange = (value: string, identifier: string) => {
    if (identifier === "long_description") {
      if (value === '<p><br></p>') {
        setError(identifier, { message: 'Long description is a required field' });
      } else {
        setError(identifier, { message: '' })
        setValue(identifier, value)
      }
      setdespcriptionContent(value);
    } else if (identifier === "short_description") {
      if (value === '<p><br></p>') {
        setError(identifier, { message: 'Short description is a required field' });
      } else {
        setError(identifier, { message: '' })
        setValue(identifier, value);
      }
      setShortDespcriptionContent(value);
    }
  };
  function ErrorShowing(errorMessage: any, identifier: string = '') {
    if (identifier === "long_description") {
      return (
        <Typography variant="body2" color={"error"} mt='67px' gutterBottom>
          {errorMessage}{" "}
        </Typography>
      );
    }
    else {
      return (
        <Typography variant="body2" color={"error"} gutterBottom>
          {errorMessage}{" "}
        </Typography>
      );
    }
  }

  const onSubmit = async (value: any) => {
    if (rowsForCourseTopic?.length > 1) {
      if (rowsForCourseMaterial.length > 1) {
        const reqData: any = {
          title: value?.title,
          is_chargeable: value?.is_chargeable,
          long_description: value?.long_description,
          short_description: value?.short_description,
          status: value?.status,
          duration: value?.courseduration,
          level: value?.courselevel,
          image: value?.imageattachment,
          video: value?.videoattachment,
          course_learning_topics: JSON.stringify(rowsForCourseTopic),
          Course_learning_material: JSON.stringify(rowsForCourseMaterial)
        }
        const formData = new FormData()
        for (var key in reqData) {
          formData.append(key, reqData[key]);
        }
        try {
          await HandleCourseCreate(formData)
          setTimeout(() => {
            router.push('/admin/courses/allcourses/')
          }, 1000)
        }
        catch (e) {
          console.log(e);
        };
      } else {
        toast.error("Please add course study materials !")
      }
    } else {
      toast.error("Please add course learning topics !")
    }
  }
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (e.target.name === "imageattachment") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setImageFile(file);
        setValue("imageattachment", file);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }
  const handleVideoChange = (e: any) => {
    const file = e.target.files[0];
    if (e.target.name === "videoattachment") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setVideoFile(file);
        setValue("videoattachment", file);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  //course cover topic boxes
  const handleClickOpenCourseTopicBox = () => {
    setopenCourseTopicBox(true);
  };
  const handleCloseCourseTopicBox = () => {
    setopenCourseTopicBox(false);
  };
  //handle topics row add topic row
  const handleAddTopicRow = () => {
    const item = {};
    setrowsForCourseTopic([...rowsForCourseTopic, item]);
  };
  const ResetTopicRow = () => {
    setrowsForCourseTopic([{}]);
  }
  //update course topic 
  const updateCourseState = (e: any) => {
    const tempRows = [...rowsForCourseTopic];
    const tempObj = rowsForCourseTopic[e.target.attributes.id.value];
    tempObj[e.target.attributes.id.value] = e.target.value;
    tempRows[e.target.attributes.id.value] = tempObj;
    setrowsForCourseTopic(tempRows);
  };
  //remove data from array
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
  //study material boxes
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
      <Box className={SidebarStyles.combineContentAndSidebar}>
        <SideBar />
        <Box className={SidebarStyles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="Courses"
            Current="Add Course"
            Text="COURSES"
            Link="/admin/courses/allcourses"
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
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12} md={12} lg={6} mt={6}>
                    <Box
                      component="img"
                      src="/Images/sideImages/add_section.svg"
                      width={"100%"}
                      height={"80%"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Typography
                      variant="h5"
                      className={styles.InputLabelFont}
                      mb={1}
                    >
                      ADD COURSE
                    </Typography>
                    <Stack direction="row" spacing={2} mb={2} mt={1}>
                      <Button variant="outlined" id={styles.viewIcon}
                        size="small" onClick={() => handleClickOpenCourseTopicBox()} startIcon={<LocalLibraryIcon />}>Add Learning Topic</Button>
                      <Button variant="outlined" id={styles.viewIcon} size="small" onClick={() => handleClickOpenStudyMaterialBox()} startIcon={<PlaylistAddIcon />}>Add Study Material</Button>
                    </Stack>
                    <Grid item mb={2}>
                      <InputLabel className={styles.InputLabelFont}>
                        Course Name
                      </InputLabel>
                      <TextField
                        placeholder="Course Name"
                        {...register("title")}
                        fullWidth
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
                        <InputLabel className={styles.InputLabelFont}>
                          Status
                        </InputLabel>
                        <Controller
                          name="status"
                          control={control}
                          defaultValue={'active'}
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
                          name="courseduration"
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
                          name="courselevel"
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
                        <InputLabel className={styles.InputLabelFont}>Image</InputLabel>
                        <Box className={styles.courseAttachmentBox}>
                          <InputLabel className={styles.subbox} >
                            <input
                              type="file"
                              {...register('imageattachment')}
                              onChange={handleImageChange}
                              hidden
                            />
                            <Typography className={styles.courseAttachments}>
                              {!imagefile.name ? "Upload" : imagefile.name}
                            </Typography>
                          </InputLabel>
                        </Box>
                        {imagefile ? '' : errors && errors.imagefile ? ErrorShowing(errors?.imagefile?.message) : ""}
                      </Grid>
                      <Grid item mb={1} lg={12}>
                        <InputLabel className={styles.InputLabelFont}>Introduction Video</InputLabel>
                        <Box className={styles.courseAttachmentBox}>
                          <InputLabel className={styles.subbox} >
                            <input
                              type="file"
                              {...register('videoattachment')}
                              onChange={handleVideoChange}
                              hidden
                            />
                            <Typography className={styles.courseAttachments}>
                              {!videofile.name ? "Upload" : videofile.name}
                            </Typography>
                          </InputLabel>
                        </Box>
                        {videofile ? '' : errors && errors.videofile ? ErrorShowing(errors?.videofile?.message) : ""}
                      </Grid>
                    </Grid>
                    <Box className={styles.wrapShortAndLongDescription}>
                      <Grid item mb={2} mt={2}>
                        <InputLabel className={styles.InputLabelFont}>
                          Short Description
                        </InputLabel>
                        <Box className={styles.quillShortDescription}>
                          <RichEditor
                            {...register("short_description")}
                            value={shortDespcriptionContent}
                            onChange={(e) =>
                              handleContentChange(e, "short_description")
                            }
                          />
                        </Box>
                        {errors && errors.short_description ? ErrorShowing(errors?.short_description?.message) : ""}
                      </Grid>
                      <Grid item className={styles.quillDescriptionTop} >
                        <InputLabel className={styles.InputLabelFont}>
                          Long Description
                        </InputLabel>
                        <Box className={styles.quillDescription}>
                          <RichEditor
                            value={despcriptionContent}
                            onChange={(e) =>
                              handleContentChange(e, "long_description")
                            }
                          />
                        </Box>
                        {errors && errors.long_description
                          ? ErrorShowing(errors?.long_description?.message, 'long_description')
                          : ""}
                      </Grid>
                    </Box>
                    <Grid item mt={2} className={!errors?.long_description?.message ? styles.addNewCourseButton : styles.SubmitButton} >
                      <Button className={styles.cancelButton} variant="contained" size="large" onClick={() => router.push('/admin/courses/allcourses')} id={SidebarStyles.muibuttonBackgroundColor}>Cancel</Button>
                      <Button type="submit" size="large" variant="contained" id={SidebarStyles.muibuttonBackgroundColor}>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>            
            </CardContent>
          </Card>
        </Box>
      </Box >
      <ToastContainer />
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
                  {rowsForCourseTopic && rowsForCourseTopic?.map((item: any, idx: any) => (
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
    </>
  );
};

export default AddCourse;
