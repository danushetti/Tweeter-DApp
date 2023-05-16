import React from "react";
import { Link } from "react-router-dom";
import "./profile.css";
import { defaultImgs } from "../defaultimgs";
import TweetInfeed from "../components/tweetInfeed";

import {Matic} from "@web3uikit/icons";

const Profile = ({contract}) => {

  return (
    <>
      <img className="profileBanner" src={defaultImgs[1]} />
      <div className="pfpContainer">
        <img className="profilePFP" src={defaultImgs[0]} />
        <div className="profileName">Daneshwari Pattanashetti</div>
        <div className="profileWallet">0x4232353432432411231113</div>

        <Link to="/Setting">
          <div className="profileEdit">Edit Profile</div>
        </Link>

        <div className="profileBio">A Web3 developer girl</div>
        <div className="profileTabs">
            <div className="profileTab">Your tweets</div>
        </div>
      </div>

      <TweetInfeed profile={true} contract={contract}></TweetInfeed>
    </>
  );
};

export default Profile;
