import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./profile.css";
import { defaultImgs } from "../defaultimgs";
import TweetInfeed from "../components/tweetInfeed";
import { Matic } from "@web3uikit/icons";
import { ethers, utils } from "ethers";

const Profile = ({contract, provider}) => {
  
  const activeAccount = JSON.parse(localStorage.getItem("activeAccount"));
  const userName = JSON.parse(localStorage.getItem("userName"));
  const userBio = JSON.parse(localStorage.getItem("userBio"));
  const userImage = JSON.parse(localStorage.getItem("userImage"));
  const userBanner = JSON.parse(localStorage.getItem("userBanner"));

  const [accountBalance, setAccountBalance] = useState(0);

  async function getAccountBalance(){
    let balance = await provider.getBalance(activeAccount);
    let ethBalance = ethers.utils.formatEther(balance);
    setAccountBalance(ethBalance.substring(0,4));
  }

  useEffect(() => {
    getAccountBalance();
  },[]);

  return (
    <>
      <img className="profileBanner" src={defaultImgs[1]} />
      <div className="pfpContainer">
        <img className="profilePFP" src={userImage} />
        <div className="profileName">{userName}</div>
        <div className="profileWallet">{activeAccount} - <Matic/> {accountBalance} MATIC</div>

        <Link to="/Settings">
          <div className="profileEdit">Edit Profile</div>
        </Link>

        <div className="profileBio">{userBio}</div>
        <div className="profileTabs">
            <div className="profileTab">Your tweets</div>
        </div>
      </div>

      <TweetInfeed profile={true} contract={contract}></TweetInfeed>
    </>
  );
};

export default Profile;
