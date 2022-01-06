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
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  Slide,
  Typography,
  Zoom,
} from "@material-ui/core";
import request from "../../axios/config";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SearchIcon from "@material-ui/icons/Search";
import PlusOneIcon from "@material-ui/icons/PlusOne";
import VisibilityIcon from "@material-ui/icons/Visibility";
const useStyles = makeStyles((theme) => ({
  calender: {
    "&.react-calendar": {
      // width: "100%",
      borderRadius: "20px",
      boxShadow:
        "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
    },
    "& abbr": {
      fontFamily: "cursive",
    },
    "& button span": {
      fontWeight: 700,
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
const TransitionFad = React.forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

export default function KeywordAssignments() {
  const [date, setDateChange] = useState(new Date());
  const [DetailBox, setDetailBox] = useState(false);
  const [searchMode, setSearchMode] = React.useState(true);
  const [searchType, setSearchType] = React.useState("Libraries");
  const [changesBox, ShowChanges] = useState(false);

  const [hashtags, setHashtags] = useState([]);
  const [hashtagsAdded, AddHashtags] = useState([]);
  const [hashtagsDeleted, DeletedHashtags] = useState([]);

  const hashtagSearchREF = useRef(null);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const handleOnDayClick = (v) => {
    setSearchMode(true);
    FetchHashtagsFromDate();
    setDetailBox(true);
  };
  const handleHashTagUpdate = async (v) => {
    setDetailBox(false);
    setSearchMode(false);
    await sleep(500);
    executeHashtagScroll();
  };
  const hanleHashTagDelete = (tage) => {
    let new_list = hashtags.filter((chip) => chip.id !== tage.id);
    setHashtags(new_list);
    DeletedHashtags([...hashtagsDeleted, tage.tag]);
  };
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };
  const handleAddHashTagItems = (v) => {
    const unique = [...new Set([...hashtagsAdded, v])];
    AddHashtags(unique);
    const new_list = hashtags.filter((tag) => tag.tag !== v);
    setHashtags(new_list);
  };
  const executeHashtagScroll = () =>
    hashtagSearchREF.current.scrollIntoView({ behavior: "smooth" });
  // APi scalling
  async function FetchHashtagsFromDate() {
    // await request.get()
    let send_date = `${date.getFullYear()}-01-${date.getDate()}`;
    await request.get(`insta/filterHashtags/${send_date}/`).then((res) => {
      setHashtags(res.data.data);
    });
  }
  const classes = useStyles();
  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Typography color="primary" variant="h4">
          Select Date
        </Typography>
      </Grid>
      <Grid item>
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
                  <Grid item key={data.id}>
                    <Chip label={data.tag} />
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
              <>
                <Grid item key={data.id}>
                  <Chip
                    color="primary"
                    label={data.tag}
                    className={classes.chip}
                    onDelete={() => {
                      hanleHashTagDelete(data);
                    }}
                  />
                </Grid>
                {searchType === "HashTags" ? (
                  <Grid item key={`${data.id} ${data.tag}`}>
                    <Chip
                      icon={<PlusOneIcon />}
                      color="secondary"
                      clickable
                      onClick={() => handleAddHashTagItems(data.tag)}
                      label={data.tag}
                      className={classes.chip}
                    />
                  </Grid>
                ) : undefined}
              </>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              fullWidth
              color="primary"
              onClick={() => ShowChanges(true)}
            >
              Changes
            </Button>
          </Grid>
        </Grid>
      </div>
      {/* show Changes */}
      <Dialog
        open={changesBox}
        TransitionComponent={TransitionFad}
        transitionDuration={1000}
        keepMounted
        onClose={() => setDetailBox(false)}
        aria-labelledby="ChangeslDialog"
      >
        <DialogTitle id="ChangeslDialog">
          Hash Tags In {date.toLocaleDateString()}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="Changes Hashtags">
            <Paper className={classes.detailBox}>
              <Grid container spacing={1} justifyContent="center">
                <Grid container item spacing={1} xs={6} justifyContent="center">
                  <Grid item xs={12}>
                    <Typography color="primary" variant="body1" align="center">
                      Added Hashtags
                    </Typography>
                  </Grid>
                  {hashtagsAdded.map((data) => (
                    <Grid item key={data}>
                      <Chip
                        color="primary"
                        label={data}
                        onDelete={() => {
                          hanleHashTagDelete(data);
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid container spacing={1} item xs={6} justifyContent="center">
                  <Grid item xs={12}>
                    <Typography
                      color="secondary"
                      variant="body1"
                      align="center"
                    >
                      Deleted Hashtags
                    </Typography>
                  </Grid>
                  {hashtagsDeleted.map((data) => (
                    <Grid item key={data}>
                      <Chip
                        color="secondary"
                        label={data}
                        onDelete={() => {
                          hanleHashTagDelete(data);
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => ShowChanges(false)} color="primary">
            Update
          </Button>
          <Button onClick={() => ShowChanges(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
