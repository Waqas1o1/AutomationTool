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
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import request from "../../axios/config";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { toast } from "react-toastify";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Autocomplete from "@material-ui/lab/Autocomplete";

// import GroupsWorkIcon from "@material-ui/icons/GroupWork";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      width: 330,
      marginLeft: "-30px",
    },
  },
  table: {
    width: "920px",
    [theme.breakpoints.down("sm")]: {
      width: 330,
    },
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
    fontSize: 12,
  },
}))(TableCell);

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const initialFields = {
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    re_password: "",
    email: "",
    is_superuser: false,
    is_active: true,
    group: "",
  };
  const [fields, setFields] = React.useState(initialFields);
  const [filter, setFilter] = useState("");
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
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
  const handleUserSave = (e) => {
    e.preventDefault();
    if (fields.password !== fields.re_password) {
      toast.error("Password not Mastch", 600);
    } else {
      SaveUsers();
    }
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
  async function Users() {
    await request.get("auth/user").then((res) => {
      setRows(res.data.data);
    });
  }
  async function UsersByName(e) {
    let name = e.target.value;
    setFilter(name);
    await request
      .get(`auth/filterUsers/${name}`)
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
    await request.get(`auth/user/${id}`).then((res) => {
      const ress = res.data;
      if (ress.error === true) {
        toast.error(ress.message);
        setConfirmBox(false);
        setIsUpdate(false);
        setAddBox(false);
      } else {
        let data = ress.data;
        let set = {
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          email: data.email,
          is_superuser: data.is_superuser,
          is_active: data.is_active,
          group:data.groups[0]
        };
        setFields(set);
      }
    });
  }
  async function DeleteUser() {
    await request.delete(`auth/user/${selectedObj.id}/`).then((res) => {
      const ress = res.data;
      if (ress.error === true) {
        toast.error(ress.message);
        setConfirmBox(false);
      } else {
        toast.info(ress.message);
        Users();
        setConfirmBox(false);
      }
    });
  }
  async function SaveUsers() {
    if (!isUpdate) {
      await request.post("auth/register/", { ...fields,group:fields.group.id }).then((res) => {
        const ress = res.data;
        if (ress.error === true) {
          console.log(ress.message);
          toast.error(ress.message);
        } else {
          toast.success(ress.message);
          Users();
        }
        setFields(initialFields);
        setAddBox(false);
      });
    } else {
      await request
        .put(`auth/user/${selectedObj.id}/`, { ...fields ,group:fields.group.id})
        .then((res) => {
          const ress = res.data;
          console.log(ress);
          if (ress.error === true) {
            let errors = ress.message;
            console.log(ress);
            for (let err in errors) {
              toast.error(`${err} ${errors[err]}`);
            }
          } else {
            toast.success(ress.message);
            Users();
          }
          setFields(initialFields);
          setAddBox(false);
        });
    }
  }
  async function Groups() {
    await request.get("auth/group").then((res) => {
      setGroups(res.data.data);
    });
  }
  //   Effects
  useEffect(() => {
    Users();
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
          <Grid item xs={7} md={10}>
            <TextField
              id="standard-basic"
              label="Find By Name"
              value={filter}
              onChange={UsersByName}
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
          <Paper elevation={3} className={classes.table}>
            <TableContainer className={classes.table}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow key={"Headers"}>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>First Name</StyledTableCell>
                    <StyledTableCell>Last Name</StyledTableCell>
                    <StyledTableCell>User Name</StyledTableCell>
                    <StyledTableCell>Email @</StyledTableCell>
                    <StyledTableCell>Super User</StyledTableCell>
                    <StyledTableCell>Active</StyledTableCell>
                    <StyledTableCell>Last Login</StyledTableCell>
                    <StyledTableCell>Joing Date</StyledTableCell>
                    <StyledTableCell>Groups</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.first_name}</TableCell>
                      <TableCell>{row.last_name}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <Checkbox disabled checked={row.is_superuser} />
                      </TableCell>
                      <TableCell>
                        <Checkbox disabled checked={row.is_active} />
                      </TableCell>
                      <TableCell>{row.last_login}</TableCell>
                      <TableCell>{row.date_joined}</TableCell>
                      <TableCell>
                        {row.groups.map((gp) => (
                          <p>{gp.name},</p>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        <Grid container spacing={3}>
                          <Grid item xs={6}>
                            <IconButton onClick={() => handleUpdate(row)}>
                              <BorderColorIcon color="primary" />
                            </IconButton>
                          </Grid>
                          <Grid item xs={6}>
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
          {"Add/Update Users"}
        </DialogTitle>
        <form style={{ display: "contents" }} onSubmit={handleUserSave}>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Add / Update single User
            </DialogContentText>
            <Grid container spacing={1}>
              {isUpdate ? (
                <>
                  <Grid item xs={6} md={5}>
                    <TextField
                      margin="dense"
                      name="first_name"
                      onChange={handleFieldsChange}
                      value={fields.first_name}
                      label="First Name"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={5}>
                    <TextField
                      margin="dense"
                      name="last_name"
                      onChange={handleFieldsChange}
                      value={fields.last_name}
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </>
              ) : null}
              <Grid item>
                <TextField
                  margin="dense"
                  name="username"
                  required
                  onChange={handleFieldsChange}
                  value={fields.username}
                  label="User Name"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  margin="dense"
                  name="email"
                  required
                  onChange={handleFieldsChange}
                  value={fields.email}
                  label="Email @"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid container item spacing={3}>
                <Grid item>
                  <FormControl>
                    <FormLabel>Superu User</FormLabel>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="is_superuuser"
                          checked={fields.is_superuser}
                          onChange={(e) =>
                            setFields({
                              ...fields,
                              is_superuser: e.target.checked,
                            })
                          }
                        />
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <FormLabel>Active</FormLabel>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="is_active"
                          checked={fields.is_active}
                          onChange={(e) =>
                            setFields({
                              ...fields,
                              is_active: e.target.checked,
                            })
                          }
                        />
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Autocomplete
                    id="combo-box-demo"
                    options={groups}
                    getOptionLabel={(option) => option.name}
                    value={fields.group}
                    style={{ width: 250 }}
                    onOpen={Groups}
                    onChange={(e, v) => setFields({ ...fields, group: v })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Group"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {isUpdate ? (
                <Grid item container>
                  <Typography color="secondary" variant="caption">
                    {" "}
                    Leave empty if you don't want to change <b>password</b>
                  </Typography>
                </Grid>
              ) : null}
              <Grid item>
                <TextField
                  margin="dense"
                  name="password"
                  onChange={handleFieldsChange}
                  value={fields.password}
                  required={!isUpdate}
                  label="Password *"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  margin="dense"
                  name="re_password"
                  required={!isUpdate}
                  onChange={handleFieldsChange}
                  value={fields.re_password}
                  label="Confirm-Password *"
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
            <Button startIcon={<AddBoxIcon />} color="primary" type="submit">
              {isUpdate ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
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
            onClick={() => DeleteUser()}
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
