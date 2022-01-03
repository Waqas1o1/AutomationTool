import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import request from "../axios/config";
import ChipInput from "material-ui-chip-input";
import { makeStyles } from "@material-ui/styles";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import "./styles/instacard.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import { toast, ToastContainer } from "react-toastify";
import FilterListIcon from "@material-ui/icons/FilterList";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@material-ui/lab/Pagination";
import WarningIcon from "@material-ui/icons/Warning";
import "./styles/flasher.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
  },
  hashtags: {
    color: "blue",
  },
  DialogBox: {
    "& .MuiDialogTitle-root": {
      textAlign: "center",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
// let videos = [];
export default function VideoLibrary(props) {
  const [hashtags, setHashtags] = useState([]);
  const [count, setCount] = useState(0);
  const [deletePrevious, setDeletePrevious] = useState(false);
  const [appendNewOnly, setAppendNewOnly] = useState(false);
  const [directories, setDirectories] = useState([]);
  const [dir, setDir] = useState("all");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterMenu, setFilterMenu] = useState(false);
  const [filterFields, setFilterFields] = useState([]);

  const [page, setPage] = useState({
    count: 0,
    currentpage: 1,
    next: `http://127.0.0.1:8000/insta/fetchVideoContentwithFilter/${JSON.stringify(
      filterFields
    )}?page=2`,
    previous: false,
  });

  const handleFilterCheckBox = (e) => {
    if (e.target.checked) {
      setFilterFields([...filterFields, e.target.name]);
    } else {
      setFilterFields(filterFields.filter((item) => item !== e.target.name));
    }
  };

  async function fetchVideosMeta(post = false, p = page.currentpage) {
    if (post === true) {
      await request
        .post("insta/fetchVideoContent/", {
          hashtags: hashtags,
          count: count,
          deletePrevious: deletePrevious,
          appendNewOnly: appendNewOnly,
        })
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
      setLoading(false);
      fetchVideosMeta();
      setLoading(false);
    } else {
      setLoading(true);
      await request
        .get(
          `insta/fetchVideoContentwithFilter/${JSON.stringify(
            filterFields
          )}/${dir}?page=${p}`
        )
        .then((res) => {
          const d = res.data;
          setLoading(false);
          const page_d = {
            ...page,
            count: d.count / 5,
            next: d.next,
            previous: d.previous,
            currentpage: p,
          };
          setPage(page_d);
          setVideos(d.results);
        })
        .catch((err) => {
          toast.error(err);
          setLoading(false);
        });
    }
  }
  async function fetchDirectories() {
    await request.get("insta/directories/").then((res) => {
      setDirectories(res.data.data);
    });
  }
  const onPageChange = (e, v) => {
    setPage({ ...page, currentpage: v });
    fetchVideosMeta(false, v);
  };

  function onSubmit() {
    setLoading(true);
    fetchVideosMeta(true);
  }

  function handleHashTagDelete(tag) {
    let new_tags = hashtags.filter((item) => item !== tag);
    setHashtags([...new_tags]);
  }
  useEffect(() => {
    fetchDirectories();
  }, []);
  const classes = useStyles();
  return (
    <Grid
      container
      justifyContent="center"
      spacing={3}
      className={classes.root}
    >
      <ToastContainer
        position="top-center"
        autoClose={4000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      <Grid item container justifyContent="center" spacing={3}>
        <Grid item>
          <ChipInput
            className={classes.hashtags}
            value={hashtags}
            variant="outlined"
            placeholder="HashTags"
            lable="Hash Tags"
            onAdd={(chip) => setHashtags([...hashtags, chip])}
            onDelete={(chip, index) => handleHashTagDelete(chip, index)}
          />
        </Grid>
        <Grid item>
          <TextField
            value={count}
            lable="No of videos per Tat"
            placeholder="Count"
            type="number"
            variant="outlined"
            onChange={(e) => setCount(e.target.value)}
            // style={{marginTop:'8px'}}
          />
        </Grid>
        {/* Swicthes */}
        <Grid item container justifyContent="center" spacing={3}>
          <Grid item>
            <FormControlLabel
              value={deletePrevious}
              control={
                <Switch
                  checked={deletePrevious}
                  onChange={(e) => setDeletePrevious(e.target.checked)}
                  color="primary"
                  checkedIcon={
                    <WarningIcon
                      style={{ color: "yellow" }}
                      fontSize="medium"
                    />
                  }
                />
              }
              label="Delete Previous"
              labelPlacement="top"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              value={appendNewOnly}
              control={
                <Switch
                  checked={appendNewOnly}
                  onChange={(e) => setAppendNewOnly(e.target.checked)}
                  color="primary"
                />
              }
              label="New Only"
              labelPlacement="top"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          fullWidth
          disabled={loading}
          className={classes.margin}
          onClick={onSubmit}
        >
          Update
        </Button>
      </Grid>
      <Grid item container justifyContent="center" spacing={6}>
        <Grid container item justifyContent="space-around">
          <Grid item md={6}>
            <Typography variant="h4" color="primary">
              Fetched Videos
              <IconButton
                aria-label="delete"
                color="primary"
                onClick={() => {
                  setVideos([]);
                  fetchVideosMeta();
                }}
              >
                <DataUsageIcon style={{ fontSize: 30 }} />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item md={4} xs={10}>
            <Autocomplete
              id="directories-box"
              options={directories}
              onChange={(e, value) => setDir(value ? value.directory : "all")}
              getOptionLabel={(option) =>
                option.directory ? option.directory : ""
              }
              renderInput={(params) => (
                <TextField {...params} label="Directories" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item md={2} xs={2}>
            <IconButton onClick={() => setFilterMenu(true)}>
              <FilterListIcon fontSize="large" color="primary" />
            </IconButton>

            <Dialog
              onClose={() => setFilterMenu(false)}
              aria-labelledby="filterMenu"
              open={filterMenu}
              fullWidth
              className={classes.DialogBox}
              keepMounted
              transitionDuration={500}
              TransitionComponent={Transition}
            >
              <DialogTitle id="filterMenu">
                Filter Files With
                <FilterListIcon color="primary" fontSize="large" />
              </DialogTitle>
              <List>
                <ListItem autoFocus>
                  <ListItemAvatar>
                    <Switch
                      onChange={handleFilterCheckBox}
                      color="primary"
                      name="upload_date"
                    />
                  </ListItemAvatar>
                  <ListItemText primary="By Uploading Date" />
                </ListItem>
                <ListItem autoFocus>
                  <ListItemAvatar>
                    <Switch
                      onChange={handleFilterCheckBox}
                      color="primary"
                      name="likes"
                    />
                  </ListItemAvatar>
                  <ListItemText primary="By Video Likes" />
                </ListItem>
                <ListItem autoFocus>
                  <ListItemAvatar>
                    <Switch
                      onChange={handleFilterCheckBox}
                      color="primary"
                      name="followers"
                    />
                  </ListItemAvatar>
                  <ListItemText primary="By User Followers" />
                </ListItem>
                <ListItem autoFocus>
                  <ListItemAvatar>
                    <Switch
                      onChange={handleFilterCheckBox}
                      color="primary"
                      name="views"
                    />
                  </ListItemAvatar>
                  <ListItemText primary="By Video Views" />
                </ListItem>
              </List>
            </Dialog>
          </Grid>
        </Grid>
        {/* Files */}

        <Grid item container justifyContent="center" spacing={4}>
          {videos.map((file) => (
            <Grid item key={file.username}>
              <div className="card">
                {/* Header */}
                <div className="username">
                  <Link
                    href={file.profile}
                    target="blank"
                    style={{ color: "#000000bf" }}
                  >
                    <AccountCircleIcon />
                  </Link>
                  <p style={{ textAlign: "center" }}>
                    {file.username}
                    <span>({file.followers})</span>
                  </p>
                </div>
                {/* Image */}
                <Link href={file.link} target="blank">
                  <img
                    className="postImage"
                    src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
                    alt="text"
                  />
                </Link>
                {/* Status */}
                <div className="status">
                  <Typography
                    variant="caption"
                    color="secondary"
                    component="span"
                    style={{ fontWeight: 700 }}
                  >
                    {file.upload_date} ({file.upload_time})
                  </Typography>
                  <div className="like">
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Typography color="secondary" variant="caption">
                          Likes : <b>{file.likes}</b>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color="secondary" variant="caption">
                          Comments : <b>{file.comments}</b>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color="secondary" variant="caption">
                          Views : <b>{file.views}</b>
                        </Typography>
                      </Grid>
                      <Grid item>
                        {file.verified ? (
                          <CheckCircleRoundedIcon
                            style={{ marginBottom: "10px" }}
                            color="secondary"
                          />
                        ) : null}
                      </Grid>
                    </Grid>
                  </div>
                  <div>
                    Dimensions : <b>{file.dimension}</b>
                    <br />
                    Frame Rate : <b>{file.framerate}</b>
                    <br />
                    codec : <b>{file.codecs}</b>
                  </div>
                  {/* <div className="comment">
                    <b>johndoe</b> So stunning
                  </div> */}
                </div>
                {/* Footer */}
                <div className="commentInput">
                  <p>{file.caption}</p>
                  <img src="https://i.stack.imgur.com/twIm6.png" alt="text" />
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        {/* Pagination */}
        <Grid item container justifyContent="center">
          <Grid item>
            <Pagination
              count={page.count}
              page={page.currentpage}
              hideNextButton={page.next !== null ? true : false}
              hidePrevButton={page.previous !== null ? true : false}
              shape="rounded"
              onChange={onPageChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
