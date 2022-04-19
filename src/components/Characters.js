import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import noImage from "../img/download.jpeg";
import {
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
} from "@material-ui/core";
import "../App.css";
const useStyles = makeStyles({
  card: {
    maxWidth: 550,
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
const privatekey = //Your Private Key
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters/";
const url = "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

const Characters = () => {
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    console.log("useEffect fired");
    async function fetchData() {
      try {
        const { data } = await axios.get(baseUrl + `${id}` + url);
        setShowData(data.data.results[0]);
        setLoading(false);
      } catch (e) {
        setIsValid(false);
        setLoading(false);
        console.log(e);
      }
    }
    fetchData();
  }, [id]);

  let description = null;

  if (showData && showData.description) {
    description = showData && showData.description.replace("");
  } else {
    description = "No Summary";
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
      <Card className={classes.card} variant="outlined">
        <CardHeader className={classes.titleHead} title={showData.name} />
        <CardMedia
          className={classes.media}
          component="img"
          image={`${showData.thumbnail.path}.${showData.thumbnail.extension}`}
          title="show image"
        />

        <CardContent>
          <Typography variant="body2" color="textSecondary" component="span">
            <dl>
              <p>
                <dt className="title">Name:</dt>
                {showData && showData.name}
              </p>
              <p>
                <dt className="title">Description:</dt>
                {description}
              </p>
            </dl>
            <div className="App">
              <Link className="showlink" to="/Characters/page/0">
                Back to Characters
              </Link>
            </div>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Characters;
