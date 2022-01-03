import {
  Avatar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { green } from "@material-ui/core/colors";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import request from "../../axios/config";
import { toast } from "react-toastify";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import DescriptionIcon from "@material-ui/icons/Description";
import "../styles/FileBtn.css";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: "0.75rem",
    padding: "20px",
  },
  avater: {
    color: "#fff",
    backgroundColor: green[500],
    position: "relevant",
    width: theme.spacing(7),
    height: theme.spacing(7),
    borderRadius: "0.75rem",
    boxShadow:
      "rgb(0 0 0 / 14%) 0rem 0.25rem 1.25rem 0rem, rgb(0 187 212 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem",
  },
  divider: {
    flexShrink: "0",
    borderTop: "0px solid rgba(0, 0, 0, 0.08)",
    borderRight: "0px solid rgba(0, 0, 0, 0.08)",
    borderLeft: "0px solid rgba(0, 0, 0, 0.08)",
    height: "0.0625rem",
    margin: "1rem 0px",
    borderBottom: "none",
    opacity: 0.25,
    backgroundColor: "transparent",
    backgroundImage:
      "linear-gradient(to right, rgba(255, 255, 255, 0), rgb(5 5 5), rgba(255, 255, 255, 0)) !important;",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function SearchingTag(props) {
  const classes = useStyles();
  const [tags, setTags] = useState([]);
  const [addBox, setAddBox] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [fields, setFields] = useState({
    tag: "",
    category: "",
    subcategory: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [uploadCSV, setUploadCSV] = useState(false);
  const [csv, setCsv] = useState({ file: "" });
  const [selectedObj, setSelectedObj] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setsubCategories] = useState([]);
  // Effects
  useEffect(() => {
    FetchTags();
  }, []);
  // Functions
  const HandleFileChange = (e) => {
    setCsv(e.target.files[0]);
    setUploadCSV(true);
  };

  const clearCSV = (e) => {
    setUploadCSV(false);
    setCsv("");
  };
  const HandleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };
  const Reset = () => {
    setFields({ name: "" ,category:"",subcategory:""});
    FetchTags();
    setConfirmBox(false);
    setUploadCSV(false);
    setAddBox(false);
    setIsUpdate(false);
  };
  const HandleUpdate = (row) => {
    setSelectedObj(row);
    setIsUpdate(true);
    GetQueryForUpdate(row.id);
    setAddBox(true);
    setUploadCSV(false);
  };
  const HandleCategoryChange = (e, value) => {
    setFields({...fields,category:value});
  };
  const HandleSubCategoryChange = (e, value) => {
    setFields({...fields,subcategory:value});
  };
  // APIs Calling
  async function DeleteSearchingTag() {
    request.delete(`insta/SearchingTags/${selectedObj.id}/`).then((rep) => {
      const res = rep.data;
      if (res.error === true) {
        for (let msg in res.message){
          toast.error(res.message[msg]);
        }
      } else {
        toast.info(res.message);
        Reset();
      }
    });
  }
  async function FetchTags() {
    request.get("insta/SearchingTags").then((res) => {
      const data = res.data.data;
      setTags(data);
    });
  }
  async function GetQueryForUpdate(id) {
    request.get(`insta/SearchingTags/${id}`).then((res) => {
      setFields(res.data.data);
    });
  }
  async function SaveOrUpdateSearchingTag(type) {
    if (!isUpdate && !csv.name) {
      await request.post("insta/SearchingTags/", { ...fields,category:fields.category.id,subcategory:fields.subcategory.id })
      .then((ress) => {
        const res = ress.data;
        if (res.error === true) {
          console.log(res);
          for (let err in res.message) {
              toast.error(res.message[err]);
          }
        } else {
          toast.info(res.message);
          Reset();
        }
      });
    }
    // CSV
    else if (uploadCSV) {
      const form = new FormData();
      form.append("file", csv);
      await request
        .post("insta/SearchingTagFromCSV/", form, {
          headers: {
            "content-type": "multipart/form-data",
            // Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((ress) => {
          const res = ress.data;
          if (res.error === true) {
            for (let err in res.message) {
              toast.error(res.message[err]);
            }
          } else {
            toast.info(res.message);
            Reset();
          }
        });
    }
    // Update
    else {
      await request
        .put(`insta/SearchingTags/${selectedObj.id}/`, { ...fields })
        .then((ress) => {
          const res = ress.data;
          if (res.error === true) {
            for (let err in res.message) {
              toast.error(res.message[err]);
            }
          } else {
            toast.info(res.message);
            Reset();
          }
        });
    }
  }

  async function Categories() {
    request.get("insta/Category").then((res) => {
      const data = res.data.data;
      setCategories(data);
    });
  }

  async function SubCategories() {
    request.get("insta/SubCategory").then((res) => {
      const data = res.data.data;
      setsubCategories(data);
    });
  }
  // Rows
  const columns = [
    {
      field: "id",
      headerName: "id",
      with: 90,
    },
    {
      field: "tag",
      headerName: "Tag",
      width: 190,
    },
    {
      field: "Category",
      headerName: "Category",
      width: 190,
      renderCell: (row) => <p>{row.row.category.name}</p>,
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      width: 190,
      renderCell: (row) => <p>{row.row.subcategory.name}</p>,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (row) => (
        <Grid container>
          <Grid item>
            <IconButton
              onClick={() => {
                setConfirmBox(true);
                setSelectedObj(row.row);
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={() => HandleUpdate(row.row)}>
              <CreateIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Container>
      <Paper elevation={3} className={classes.paper} variant="outlined">
        <Grid container spacing={1}>
          <Grid item>
            <Avatar variant="rounded" className={classes.avater}>
              <LocalOfferIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              SearchingTag
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              size="medium"
              color="primary"
              onClick={() => {
                setAddBox(true);
                setIsUpdate(false);
              }}
            >
              <AddCircleRoundedIcon />
            </IconButton>
          </Grid>
        </Grid>
        <br />
        <Grid container>
          <Grid item xs={12}>
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={tags}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
              />
            </div>
          </Grid>
        </Grid>
      </Paper>
      {/* Model */}
      <Dialog
        open={addBox}
        TransitionComponent={Transition}
        transitionDuration={500}
        keepMounted
        onClose={() => setAddBox(false)}
      >
        <DialogTitle id="add-dialog-Box">
          <LocalOfferIcon />
          {"Add SearchingTag"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Add SearchingTag in bulk (.csv) / AddSearchingTag Single
            SearchingTag
          </DialogContentText>
          <Grid container justifyContent="center" spacing={1}>
            <Grid item>
              <Autocomplete
                id="category-box-demo"
                options={categories}
                getOptionLabel={(option) => option.name}
                style={{ width: 200 }}
               
                onOpen={Categories}
                onChange={HandleCategoryChange}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
              />
            </Grid>
            <Grid item>
              <Autocomplete
                id="subcategory-box-demo"
                options={subCategories}
                value={fields.subcategory}
                getOptionLabel={(option) => option.name}
                style={{ width: 200 }}
                name='subcategory'
                onOpen={SubCategories}
                onChange={HandleSubCategoryChange}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
              />
            </Grid>
            <Grid item>
              <TextField
                margin="dense"
                name="tag"
                value={fields.tag}
                onChange={HandleFieldChange}
                label="Tag"
                disabled={uploadCSV}
                variant="outlined"
                fullWidth
              />
            </Grid>
            {isUpdate ? null : (
              <>
                <Grid item xs={12}>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid item container justifyContent="center">
                  <Typography variant="subtitle2">
                    Warnning! the formate must be correct |
                    <a href="wwww.google.com" target="blank">
                      <b style={{ color: "#E2ED" }}> template</b>
                    </a>
                  </Typography>
                </Grid>
                <Grid item>
                  <div className="upload-btn-wrapper">
                    <button className="btn">
                      {" "}
                      {csv.name ? csv.name : "Upload CSV"}{" "}
                    </button>
                    <input type="file" onChange={HandleFileChange} />
                  </div>

                  <IconButton onClick={clearCSV}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddBox(false)} color="secondary">
            cancel
          </Button>

          {isUpdate ? (
            <Button
              onClick={() => SaveOrUpdateSearchingTag()}
              size="large"
              startIcon={<CreateIcon fontSize="large" />}
              color="primary"
            >
              Update
            </Button>
          ) : (
            <Button
              onClick={() => SaveOrUpdateSearchingTag()}
              size="large"
              startIcon={
                csv.name ? (
                  <DescriptionIcon />
                ) : (
                  <AddCircleRoundedIcon fontSize="large" />
                )
              }
              color="primary"
            >
              {csv.name ? "File" : "Add"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* Confirm Box */}
      <Dialog
        open={confirmBox}
        TransitionComponent={Transition}
        transitionDuration={500}
        keepMounted
        onClose={() => setConfirmBox(false)}
      >
        <DialogTitle id="confirm-dialog-Box">
          <ReportProblemIcon />
          {" Are you Sure you want to delete ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure yo want to Delete {selectedObj.id}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmBox(false)} color="secondary">
            cancel
          </Button>
          <Button
            onClick={() => DeleteSearchingTag()}
            size="large"
            startIcon={<DeleteOutlineIcon fontSize="large" />}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
