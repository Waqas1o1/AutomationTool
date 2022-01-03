import {
  Avatar,
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import { green } from "@material-ui/core/colors";
import CameraRollIcon from "@material-ui/icons/CameraRoll";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import SwitchVideoIcon from "@material-ui/icons/SwitchVideo";

const useStyles = makeStyles((theme) => ({
  itemBox: {
    width: "300px",
    height: "150px",
    color: "rgba(0, 0, 0, 0.87)",
    transition: " box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    minWidth: "0px",
    overflowWrap: "break-word",
    backgroundColor: "rgb(255, 255, 255)",
    backgroundClip: "border-box",
    border: "0px solid rgba(0, 0, 0, 0.125)",
    borderRadius: "0.75rem",
    boxShadow:
      "rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem",
    overflow: "visible",
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
  avater: {
    color: "#fff",
    backgroundColor: green[500],
    position: "absolute",
    top: "-15px",
    left: "15px",
    width: theme.spacing(7),
    height: theme.spacing(7),
    borderRadius: "0.75rem",
    boxShadow:
      "rgb(0 0 0 / 14%) 0rem 0.25rem 1.25rem 0rem, rgb(0 187 212 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem",
  },
  box: {
    width: "100%",
    textAlign: "end",
  },
  boxTitle: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    opacity: 0.8,
    fontSize: "0.875rem",
    fontWeight: 250,
    letterSpacing: "0.02857em",
    lineHeight: 1,
    color: "rgb(123, 128, 154)",
  },
  boxTextCount: {
    margin: "0px",
    fontSize: "1.4rem",
    lineHeight: 1.375,
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: "0.00735em",
    opacity: 1,
    textTransform: "none",
    verticalAlign: "unset",
    textDecoration: "none",
    color: "rgb(52, 71, 103)",
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  return (
    <Grid container justifyContent="space-around" spacing={3}>
      <Grid item>
        <Paper elevation={3} className={classes.itemBox}>
          <Avatar variant="rounded" className={classes.avater}>
            <PlayCircleOutlineIcon />
          </Avatar>
          <Box component="div" m={0.1} p={2} className={classes.box}>
            <Box component="span" p={1}>
              <Typography
                variant="caption"
                className={classes.boxTitle}
                align="right"
              >
                Total Videos
              </Typography>
              <br />
              <Typography
                variant="caption"
                className={classes.boxTextCount}
                align="right"
              >
                2023
              </Typography>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Box component="div" p={0.2}>
            <Typography
              variant="caption"
              className={classes.boxTitle}
              style={{ marginLeft: "10px", fontSize: "12px" }}
            >
              <b style={{ color: "green" }}>3%</b>then last month
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item>
        <Paper elevation={3} className={classes.itemBox}>
          <Avatar variant="rounded" className={classes.avater}>
            <CameraRollIcon />
          </Avatar>
          <Box component="div" m={0.1} p={2} className={classes.box}>
            <Box component="span" p={1}>
              <Typography
                variant="caption"
                className={classes.boxTitle}
                align="right"
              >
                Aequired Videos
              </Typography>
              <br />
              <Typography
                variant="caption"
                className={classes.boxTextCount}
                align="right"
              >
                1132
              </Typography>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Box component="div" p={0.2}>
            <Typography
              variant="caption"
              className={classes.boxTitle}
              style={{ marginLeft: "10px", fontSize: "12px" }}
            >
              <b style={{ color: "green" }}>23%</b>then last month
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item>
        <Paper elevation={3} className={classes.itemBox}>
          <Avatar variant="rounded" className={classes.avater}>
            <StopScreenShareIcon />
          </Avatar>
          <Box component="div" m={0.1} p={2} className={classes.box}>
            <Box component="span" p={1}>
              <Typography
                variant="caption"
                className={classes.boxTitle}
                align="right"
              >
                Rejected Videos
              </Typography>
              <br />
              <Typography
                variant="caption"
                className={classes.boxTextCount}
                align="right"
              >
                59020
              </Typography>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Box component="div" p={0.2}>
            <Typography
              variant="caption"
              className={classes.boxTitle}
              style={{ marginLeft: "10px", fontSize: "12px" }}
            >
              <b style={{ color: "green" }}>3%</b>then last month
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item>
        <Paper elevation={3} className={classes.itemBox}>
          <Avatar variant="rounded" className={classes.avater}>
            <SwitchVideoIcon />
          </Avatar>
          <Box component="div" m={0.1} p={2} className={classes.box}>
            <Box component="span" p={1}>
              <Typography
                variant="caption"
                className={classes.boxTitle}
                align="right"
              >
                Pending Videos
              </Typography>
              <br />
              <Typography
                variant="caption"
                className={classes.boxTextCount}
                align="right"
              >
                383
              </Typography>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Box component="div" p={0.2}>
            <Typography
              variant="caption"
              className={classes.boxTitle}
              style={{ marginLeft: "10px", fontSize: "12px" }}
            >
              <b style={{ color: "green" }}>10%</b>then last month
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
