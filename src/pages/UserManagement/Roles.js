import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import { withStyles } from "@material-ui/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  TextField,
} from "@material-ui/core";
import request from "../../axios/config";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { toast } from "react-toastify";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import GroupWorkIcon from "@material-ui/icons/GroupWork";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
    height: "70px",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [fields, setFields] = React.useState({ name: "" });
  const [filter, setFilter] = useState("");
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [addBox, setAddBox] = useState(false);
  const [ConfirmBox, setConfirmBox] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedObj, setSelectedObj] = React.useState("");

  const handleFieldsChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleGroupSave = () => {
    SaveGroups();
  };
  const handleDeleteClick = (obj) => {
    setSelectedObj(obj);
    setConfirmBox(true);
  };
  const handleUpdate = (obj) => {
    GetQueryForUpdate(obj.id);
    setIsUpdate(true);
    setSelectedObj(obj);
    setAddBox(true);
  };

  //   APIS
  async function Groups() {
    await request.get("auth/group").then((res) => {
      setRows(res.data.data);
    });
  }
  async function GroupsByName(e) {
    let name = e.target.value;
    setFilter(name);
    await request
      .get(`auth/filterGroups/${name}`)
      .then((res) => {
        let resp = res.data.data;
        if (resp !== undefined) {
          setRows(resp);
        }
      })
      .catch((err) => {
        console.log("no result found");
      });
  }

  async function GetQueryForUpdate(id) {
    await request.get(`auth/group/${id}`).then((res) => {
      const ress = res.data;
      if (ress.error === true) {
        toast.error(ress.message);
        setConfirmBox(false);
        setIsUpdate(false);
        setAddBox(false);
      } else {
        setFields(ress.data);
      }
    });
  }
  async function DeleteGroup() {
    await request.delete(`auth/group/${selectedObj.id}/`).then((res) => {
      const ress = res.data;
      if (ress.error === true) {
        toast.error(ress.message);
        setConfirmBox(false);
      } else {
        toast.info(ress.message);
        Groups();
        setConfirmBox(false);
      }
    });
  }
  async function SaveGroups() {
    if (!isUpdate) {
      await request.post("auth/group/", { ...fields }).then((res) => {
        const ress = res.data;
        if (ress.error === true) {
          toast.error(ress.message);
        } else {
          toast.success(ress.message);
          Groups();
        }
        setFields({ name: "" });
        setAddBox(false);
      });
    } else {
      await request
        .put(`auth/group/${selectedObj.id}/`, { ...fields })
        .then((res) => {
          const ress = res.data;
          if (ress.error === true) {
            toast.error(ress.message);
          } else {
            toast.success(ress.message);
            Groups();
          }
          setFields({ name: "" });
          setAddBox(false);
        });
    }
  }
  //   Effects
  useEffect(() => {
    Groups();
  }, []);

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        className={classes.root}
      >
        <Grid item container spacing={3}>
          <Grid item xs={2} md={1}>
            <GroupWorkIcon color='primary' style={{marginTop:'10px',fontSize:'50px'}}/>
          </Grid>
          <Grid item xs={7} md={10}>
            <TextField
              id="standard-basic"
              label="Find By Name"
              value={filter}
              onChange={GroupsByName}
            />
          </Grid>
          <Grid item xs={3} md={1}>
            <IconButton
              onClick={() => {
                setAddBox(true);
                setIsUpdate(false);
              }}
            >
              <AddBoxIcon fontSize="large" color="primary" />
            </IconButton>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <TableContainer className={classes.container}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell key={row.id}>{row.id}</TableCell>
                      <TableCell key={row.name}>{row.name}</TableCell>
                      <TableCell key={`${row.name}${row.id}`} align="center">
                        <Grid container justifyContent="center" spacing={1}>
                          <Grid item>
                            <IconButton onClick={() => handleUpdate(row)}>
                              <BorderColorIcon color="primary" />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton onClick={() => handleDeleteClick(row)}>
                              <DeleteOutlineIcon color="secondary" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
      {/* Add Box */}
      <Dialog
        open={addBox}
        TransitionComponent={Transition}
        transitionDuration={500}
        keepMounted
        onClose={() => {
          setAddBox(false);
          setIsUpdate(false);
        }}
      >
        <DialogTitle id="add-dialog-Box">
          <AddBoxIcon color="primary" />
          {"Add/Update Category"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Add / Update SIngle Group
          </DialogContentText>
          <Grid container justifyContent="center">
            <Grid item>
              <TextField
                margin="dense"
                name="name"
                onChange={handleFieldsChange}
                value={fields.name}
                label="Name"
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
          <Button
            startIcon={<AddBoxIcon />}
            onClick={handleGroupSave}
            color="primary"
          >
            {isUpdate ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Box */}
      <Dialog
        open={ConfirmBox}
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
            Are you sure yo want to Delete ({selectedObj.id})
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmBox(false)} color="secondary">
            cancel
          </Button>
          <Button
            onClick={() => DeleteGroup()}
            size="large"
            startIcon={<DeleteOutlineIcon fontSize="large" />}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
