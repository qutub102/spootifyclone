import React, { Component, Fragment } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import axios from "axios";
import Loader from "../../../common/components/Loader/Loader";
import config from "../../../config";

export default class Discover extends Component {
  constructor() {
    super();
    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
      loading: true,
    };
  }

  componentDidMount() {
    //reference -> https://developer.spotify.com/documentation/general/guides/authorization-guide/
    axios(config.api.authUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(config.api.clientId + ":" + config.api.clientSecret),
        // btoa() => is a method encodes a string in base-64
      },
      data: "grant_type=client_credentials",
      method: "POST",
    })
      .then((res) => {
        this.setState({ token: res.data.access_token });
        // reference -> https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-new-releases
        axios(
          `${config.api.baseUrl}/browse/new-releases?country=SE&offset=0&limit=20`,
          {
            method: "GET",
            headers: { Authorization: "Bearer " + res.data.access_token },
          }
        ).then((newRel) => {
          this.setState({ newReleases: newRel.data.albums.items });
        });

        axios(`${config.api.baseUrl}/browse/featured-playlists`, {
          method: "GET",
          headers: { Authorization: "Bearer " + res.data.access_token },
        }).then((fp) => {
          this.setState({ playlists: fp.data.playlists.items });
        });
        axios(`${config.api.baseUrl}/browse/categories`, {
          method: "GET",
          headers: { Authorization: "Bearer " + res.data.access_token },
        }).then((cat) => {
          this.setState({
            categories: cat.data.categories.items,
            loading: false,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        {this.state.loading ? (
          <center>
            {" "}
            <Loader />
          </center>
        ) : (
          <Fragment>
            <DiscoverBlock
              text="RELEASED THIS WEEK"
              id="released"
              data={newReleases}
            />
            <DiscoverBlock
              text="FEATURED PLAYLISTS"
              id="featured"
              data={playlists}
            />
            <DiscoverBlock
              text="BROWSE"
              id="browse"
              data={categories}
              imagesKey="icons"
            />
          </Fragment>
        )}
      </div>
    );
  }
}
