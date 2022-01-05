import { makeStyles } from "@material-ui/styles";
import React, { useRef, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  Slide,
  Typography,
} from "@material-ui/core";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SearchIcon from "@material-ui/icons/Search";
const useStyles = makeStyles((theme) => ({
  calender: {
    "&.react-calendar": {
      width: "100%",
    },
    "& abbr": {
      fontFamily: "cursive",
    },
  },
  detailBox: {
    width: "500px",
    padding: "10px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function KeywordAssignments() {
  const [date, setDateChange] = useState(new Date());
  const [DetailBox, setDetailBox] = useState(false);
  const [searchMode, setSearchMode] = React.useState(true);
  const [searchType, setSearchType] = React.useState("Libraries");
  const hashtagSearchREF = useRef(null);
  let hash = [
    { key: 0, label: "Angular" },
    { key: 1, label: "jQuery" },
    { key: 2, label: "Polymer" },
    { key: 3, label: "React" },
    { key: 4, label: "Vue.js" },
    { key: 5, label: "Angular5" },
    { key: 6, label: "jQuery6" },
    { key: 7, label: "Polymer7" },
    { key: 8, label: "React8" },
    { key: 9, label: "Vue.js9" },
    { key: 10, label: "Angular10" },
    { key: 11, label: "jQuery11" },
    { key: 12, label: "Polymer12" },
    { key: 13, label: "React13" },
    { key: 14, label: "Vue.js14" },
  ];
  const [hashtags, setHashtags] = useState(hash);
  const handleOnDayClick = (v) => {
    setDetailBox(true);
  };
  const handleHashTagUpdate = (v) => {
    executeHashtagScroll();
    setDetailBox(false);
    setSearchMode(false);
  };
  const hanleHashTagDelete = (tage) => {
    // setChipData((chips) => chips.filter((chip) => chip.key !== tage.key));
  };
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };
  const executeHashtagScroll = () => hashtagSearchREF.current.scrollIntoView();
  const classes = useStyles();
  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Typography color="primary" variant="h4">
          Select Date
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1" color="secondary">
          Calender
        </Typography>
        <Calendar
          className={classes.calender}
          onChange={setDateChange}
          onClickDay={handleOnDayClick}
          value={date}
        />
      </Grid>
      {/* /Detail Dialog Box */}
      <Dialog
        open={DetailBox}
        TransitionComponent={Transition}
        transitionDuration={800}
        keepMounted
        onClose={() => setDetailBox(false)}
        aria-labelledby="DetailDialog"
        aria-describedby="Relevent Hashtags"
      >
        <DialogTitle id="DetailDialog">
          Hash Tags In {date.toLocaleDateString()}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="Relevent Hashtags">
            <Paper className={classes.detailBox}>
              <Grid container spacing={1} justifyContent="center">
                {hashtags.map((data) => (
                  <Grid item key={data.label}>
                    <Chip label={data.label} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHashTagUpdate} color="primary">
            Update
          </Button>
          <Button onClick={() => setDetailBox(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      {/* Hashtags Oprations */}
      <div hidden={searchMode}>
        <Divider />
        <Grid container spacing={8} innerRef={hashtagSearchREF}>
          <Grid item>
            <FormControl className={classes.margin}>
              <InputLabel htmlFor="serach-hashtag">Search Tags</InputLabel>
              <Input
                id="serach-hashtag"
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <RadioGroup
                name="searchType"
                value={searchType}
                onChange={handleSearchTypeChange}
              >
                <FormControlLabel
                  value="Libraries"
                  control={<Radio />}
                  label="Libraries"
                />
                <FormControlLabel
                  value="HashTags"
                  control={<Radio />}
                  label="Insta HashTags"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item container component={Paper} spacing={3}>
            {hashtags.map((data) => (
              <Grid item key={data.key}>
                <Chip
                  label={data.label}
                  className={classes.chip}
                  onDelete={() => {
                    hanleHashTagDelete(data);
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth color="primary">
              See Changes
            </Button>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}
