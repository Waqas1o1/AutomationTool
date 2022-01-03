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
  //   TextField,
  Typography,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { green } from "@material-ui/core/colors";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import DnsIcon from "@material-ui/icons/Dns";
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
export default function SubCategory(props) {
  const classes = useStyles();
  const [subcategories, setsubCategories] = useState([]);
  const [addBox, setAddBox] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [fields, setFields] = useState({ name: "",category:"" });
  const [isUpdate, setIsUpdate] = useState(false);
  const [uploadCSV, setUploadCSV] = useState(false);
  const [csv, setCsv] = useState({ file: "" });
  const [selectedObj, setSelectedObj] = useState("");
  const [categories, setCategories] = useState([]);
  // Effects
  useEffect(() => {
    subCategories();
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
    setFields({ name: "" });
    subCategories();
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
  // APIs Calling
  async function DeleteSubCategory() {
    request.delete(`insta/SubCategory/${selectedObj.id}/`).then((rep) => {
      const res = rep.data;
      if (res.error === true) {
        toast.error(res.message);
      } else {
        toast.info(res.message);
        Reset();
      }
    });
  }
  async function subCategories() {
    request.get("insta/SubCategory").then((res) => {
      const data = res.data.data;
      setsubCategories(data);
    });
  }
  async function GetQueryForUpdate(id) {
    request.get(`insta/SubCategory/${id}`).then((res) => {
      setFields(res.data.data);
    });
  }

  async function SaveOrUpdateSubCategory(type) {
    if (!isUpdate && !csv.name) {
      await request.post("insta/SubCategory/", { ...fields,category:fields.category.id }).then((ress) => {
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
    // CSV
    else if (uploadCSV) {
      const form = new FormData();
      form.append("file", csv);
      await request
        .post("insta/SubCategoryFromCSV/", form, {
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
        .put(`insta/SubCategory/${selectedObj.id}/`, { ...fields,category:fields.category.id })
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

  // Rows
  const columns = [
    {
      field: "id",
      headerName: "id",
      with: 90,
    },
    {
      field: "name",
      headerName: "SubCategory",
      width: 170,
    },
    {
      field: "category",
      headerName: "Category",
      width: 190,
      renderCell: (row) => <p>{row.row.category.name}</p>,
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
              <DnsIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              SubCategory
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
                rows={subcategories}
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
          <DnsIcon />
          {"Add SubCategory"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Add SubCategory in bulk (.csv) / AddSubCategory Single SubCategory
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
              <TextField
                margin="dense"
                name="name"
                onChange={HandleFieldChange}
                value={fields.name}
                label="Sub Category"
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
              onClick={() => SaveOrUpdateSubCategory()}
              size="large"
              startIcon={<CreateIcon fontSize="large" />}
              color="primary"
            >
              Update
            </Button>
          ) : (
            <Button
              onClick={() => SaveOrUpdateSubCategory()}
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
            onClick={() => DeleteSubCategory()}
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
