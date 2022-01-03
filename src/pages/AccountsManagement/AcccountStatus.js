import {
  Avatar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import request from "../../axios/config";
import { toast } from "react-toastify";
import CreateIcon from "@material-ui/icons/Create";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import "../styles/FileBtn.css";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

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
export default function AccountStatus(props) {
  const classes = useStyles();
  const [statuses, setStatuses] = useState([]);
  const [addBox, setAddBox] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [fields, setFields] = useState({ status: "" });
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedObj, setSelectedObj] = useState("");
  // Effects
  useEffect(() => {
    fetchstatus();
  }, []);
  // Functions

  const HandleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    // setUploadCSV(true);
  };
  const Reset = () => {
    setFields({ status: "" });
    fetchstatus();
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
  async function DeleteAccountStatus() {
    request.delete(`accounts/Status/${selectedObj.id}/`).then((rep) => {
      const res = rep.data;
      if (res.error === true) {
        toast.error(res.message);
      } else {
        toast.info(res.message);
        Reset();
      }
    });
  }
  async function fetchstatus() {
    request.get("accounts/Status").then((res) => {
      const data = res.data.data;
      setStatuses(data);
    });
  }
  async function GetQueryForUpdate(id) {
    request.get(`accounts/Status/${id}`).then((res) => {
      setFields(res.data.data);
    });
  }

  async function SaveOrUpdateAccountStatus(type) {
    if (!isUpdate) {
      await request.post("accounts/Status/", { ...fields }).then((ress) => {
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
        .put(`accounts/Status/${selectedObj.id}/`, { ...fields })
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
      width: 170,
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
              <LiveHelpIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              AccountStatus
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
                rows={statuses}
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
          <LiveHelpIcon />
          {"Add AccountStatus"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Add AccountStatus in bulk (.csv) / AddAccountStatus Single
            AccountStatus
          </DialogContentText>
          <Grid container justifyContent="center">
            <Grid item>
              <TextField
                margin="dense"
                name="status"
                onChange={HandleFieldChange}
                value={fields.status}
                label="Status"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddBox(false)} color="secondary">
            cancel
          </Button>

          {isUpdate ? (
            <Button
              onClick={() => SaveOrUpdateAccountStatus()}
              size="large"
              startIcon={<CreateIcon fontSize="large" />}
              color="primary"
            >
              Update
            </Button>
          ) : (
            <Button
              onClick={() => SaveOrUpdateAccountStatus()}
              size="large"
              startIcon={<AddCircleRoundedIcon fontSize="large" />}
              color="primary"
            >
              Add
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
            onClick={() => DeleteAccountStatus()}
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
