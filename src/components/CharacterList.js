import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SearchCharacters from "./CharacterSearch";
import noImage from "../img/download.jpeg";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";

import "../App.css";
import { red } from "@material-ui/core/colors";
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
    color: "#B80000",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

const md5 = require("blueimp-md5");
const publickey = "c2c23a089a3e1f6b0c9caab777e30000";
const privatekey = "bd161e7d2f5d09fd30fbcdc0db7b98c8be1ae5da";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
const url = baseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

const CharacterList = () => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const { pagevalue } = useParams();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(true);
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        let id = parseInt(pagevalue);
        if (id < 0 || isNaN(id) || typeof id !== "number") {
          setIsValid(false);
          setLoading(false);
          return;
        }
        const { data } = await axios.get(
          url + "&limit=" + 52 + "&offset=" + 52 * parseInt(pagevalue)
        );
        setShowsData(data.data.results);
        if (data.data.results.length === 0) {
          setIsValid(false);
          setLoading(false);
          return;
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
        setIsValid(false);
        setLoading(false);
        return;
      }
    }
    fetchData();
  }, [pagevalue]);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          url +
            "&nameStartsWith=" +
            searchTerm +
            "&limit=" +
            52 +
            "&offset=" +
            52 * parseInt(pagevalue)
        );
        setSearchData(data.data.results);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchData();
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/Characters/${show.id}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={`${show.thumbnail.path}.${show.thumbnail.extension}`}
                title="show image"
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant="h6"
                  component="h2"
                >
                  {show.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {show.description
                    ? show.description.replace(regex, "").substring(0, 139) +
                      "..."
                    : "No Summary"}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        let show = shows;
        return buildCard(show);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }

  if (!isValid) {
    return <h1>404 Not Found</h1>;
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <SearchCharacters searchValue={searchValue} />
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
        <br />
        <br />
        <br />
        <br />
        <Button>
          <Link
            className="showlink"
            to={`/characters/page/${
              parseInt(pagevalue) - 1 < 0 ? 0 : parseInt(pagevalue) - 1
            }`}
          >
            Previous
          </Link>
        </Button>
        &nbsp;
        <p> {pagevalue} </p>
        &nbsp;
        <Button>
          <Link
            className="showlink"
            to={`/characters/page/${
              parseInt(pagevalue) + 1 > 29 ? 29 : parseInt(pagevalue) + 1
            }`}
          >
            Next
          </Link>
        </Button>
      </div>
    );
  }
};

export default CharacterList;
