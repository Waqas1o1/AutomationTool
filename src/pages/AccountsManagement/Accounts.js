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
import ExportDataGrid from "../../components/ExportCsv";
import React, { useEffect, useState } from "react";
import { green } from "@material-ui/core/colors";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import request from "../../axios/config";
import { toast } from "react-toastify";
import CreateIcon from "@material-ui/icons/Create";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import RemoveFromQueueIcon from "@material-ui/icons/RemoveFromQueue";
import CloseIcon from "@material-ui/icons/Close";
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
export default function Accounts(props) {
  const classes = useStyles();
  const [accounts, setAccounts] = useState([]);
  const [addBox, setAddBox] = useState(false);
  const [csv, setCsv] = useState({ file: "" });
  const [confirmBox, setConfirmBox] = useState(false);
  const initialFields = {
    purpose: "",
    status: "",
    type: "",
    assgined_to: "",
    created_by: "",
    username: "",
    password: "",
    email: "",
    contact: "",
  };
  const [fields, setFields] = useState(initialFields);
  const [purposes, setPurposes] = useState([]);
  const [users, setUsers] = useState([]);
  const [types, settypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [uploadCSV, setUploadCSV] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedObj, setSelectedObj] = useState("");

  const HandleFileChange = (e) => {
    setCsv(e.target.files[0]);
  };

  const clearCSV = (e) => {
    setUploadCSV(false);
    setCsv("");
  };
  // Effects
  useEffect(() => {
    fetchAccounts();
  }, []);
  // Functions

  const HandleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };
  const Reset = () => {
    setFields(initialFields);
    fetchAccounts();
    setUploadCSV(false);
    setConfirmBox(false);
    setAddBox(false);
    setIsUpdate(false);
  };
  const HandleUpdate = (row) => {
    setSelectedObj(row);
    setIsUpdate(true);
    GetQueryForUpdate(row.id);
    setAddBox(true);
  };
  // APIs Calling
  async function DeleteAccounts() {
    request.delete(`/accounts/Account/${selectedObj.id}/`).then((rep) => {
      const res = rep.data;
      if (res.error === true) {
        toast.error(res.message);
      } else {
        toast.info(res.message);
        Reset();
      }
    });
  }
  async function fetchAccounts() {
    request.get("/accounts/Account").then((res) => {
      const data = res.data.data;
      setAccounts(data);
    });
  }
  async function GetQueryForUpdate(id) {
    request.get(`/accounts/Account/${id}/`).then((res) => {
      setFields(res.data.data);
    });
  }
  async function SaveOrUpdateAccounts(type) {
    if (!isUpdate && !uploadCSV) {
      const send_dict = {
        ...fields,
        type: fields.type.id,
        purpose: fields.purpose.id,
        status: fields.status.id,
        assgined_to: fields.assgined_to.id,
        created_by: fields.created_by.id,
      };
      await request
        .post("/accounts/Account/", { ...send_dict })
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
    // CSV
    else if (uploadCSV) {
      const form = new FormData();
      form.append("file", csv);
      await request
        .post("insta/CategoryFromCSV/", form, {
          headers: {
            "content-type": "multipart/form-data",
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
      const send_dict = {
        ...fields,
        type: fields.type.id,
        purpose: fields.purpose.id,
        status: fields.status.id,
        assgined_to: fields.assgined_to.id,
        created_by: fields.created_by.id,
      };
      await request
        .put(`/accounts/Account/${selectedObj.id}/`, { ...send_dict })
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
  async function fetchPurposess() {
    request.get("/accounts/Purpose").then((res) => {
      const data = res.data.data;
      setPurposes(data);
    });
  }
  async function fetchStatuses() {
    request.get("accounts/Status").then((res) => {
      const data = res.data.data;
      setStatuses(data);
    });
  }
  async function fetchTypes() {
    request.get("accounts/Type").then((res) => {
      const data = res.data.data;
      settypes(data);
    });
  }
  async function fetchUsers() {
    request.get("auth/user").then((res) => {
      const data = res.data.data;
      setUsers(data);
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
      field: "status",
      headerName: "Status",
      width: 150,
      valueFormatter: ({ value }) => `${value.status}`,
      renderCell: (row) => <p>{row.row.status.status}</p>,
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      valueFormatter: ({ value }) => `${value.type}`,
      renderCell: (row) => <p>{row.row.type.type}</p>,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      width: 150,
      valueFormatter: ({ value }) => `${value.purpose}`,
      renderCell: (row) => <p>{row.row.purpose.purpose}</p>,
    },
    {
      field: "assgined_to",
      headerName: "Assgined To",
      width: 160,
      valueFormatter: ({ value }) => `${value.username}`,
      renderCell: (row) => <p>{row.row.assgined_to.username}</p>,
    },
    {
      field: "created_by",
      headerName: "Created By",
      width: 160,
      valueFormatter: ({ value }) => `${value.username}`,
      renderCell: (row) => <p>{row.row.created_by.username}</p>,
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
    },
    {
      field: "username",
      headerName: "Passoword",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "contact",
      headerName: "Contact",
      width: 150,
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
              <RemoveFromQueueIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              Accounts
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
              <ExportDataGrid
                rows={accounts}
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
        <form
          style={{ display: "contents" }}
          onSubmit={(e) => {
            e.preventDefault();
            SaveOrUpdateAccounts();
          }}
        >
          <DialogTitle>
            <RemoveFromQueueIcon />
            Add Accounts
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add Accounts in bulk (.csv) / AddAccounts Single Accounts
            </DialogContentText>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Autocomplete
                  options={types}
                  value={fields.type}
                  getOptionLabel={(option) => option.type}
                  onOpen={fetchTypes}
                  onChange={(e, v) => setFields({ ...fields, type: v })}
                  style={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Type"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  options={purposes}
                  value={fields.purpose}
                  getOptionLabel={(option) => option.purpose}
                  onOpen={fetchPurposess}
                  style={{ width: "100%" }}
                  onChange={(e, v) => setFields({ ...fields, purpose: v })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Purpose"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={statuses}
                  value={fields.status}
                  getOptionLabel={(option) => option.status}
                  onOpen={fetchStatuses}
                  style={{ width: "100%" }}
                  onChange={(e, v) => setFields({ ...fields, status: v })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Status"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  options={users}
                  value={fields.assgined_to}
                  getOptionLabel={(option) => option.username}
                  onOpen={fetchUsers}
                  style={{ width: "100%" }}
                  onChange={(e, v) => setFields({ ...fields, assgined_to: v })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assgined To"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  options={users}
                  value={fields.created_by}
                  getOptionLabel={(option) => option.username}
                  onOpen={fetchUsers}
                  style={{ width: "100%" }}
                  onChange={(e, v) => setFields({ ...fields, created_by: v })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Created By"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  placeholder="Username"
                  name="username"
                  required
                  variant="outlined"
                  fullWidth
                  value={fields.username}
                  onChange={HandleFieldChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  placeholder="password"
                  variant="outlined"
                  type="password"
                  required
                  name="password"
                  fullWidth
                  value={fields.password}
                  onChange={HandleFieldChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  placeholder="Email (Optional)"
                  variant="outlined"
                  name="email"
                  fullWidth
                  value={fields.email}
                  onChange={HandleFieldChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  placeholder="Contact (Optional)"
                  variant="outlined"
                  name="contact"
                  fullWidth
                  value={fields.contact}
                  onChange={HandleFieldChange}
                />
              </Grid>
              {isUpdate ? null : (
                <>
                  <Grid item>
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
                  <Grid item container justifyContent="center">
                    <div className="upload-btn-wrapper">
                      <button className="btn">
                        {csv.name ? csv.name : "Upload CSV"}
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
                type="submit"
                size="large"
                startIcon={<CreateIcon fontSize="large" />}
                color="primary"
              >
                Update
              </Button>
            ) : (
              <Button
                type="submit"
                size="large"
                startIcon={<AddCircleRoundedIcon fontSize="large" />}
                color="primary"
              >
                Add
              </Button>
            )}
          </DialogActions>
        </form>
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
            onClick={() => DeleteAccounts()}
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
