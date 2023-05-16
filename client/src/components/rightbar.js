import React from "react";
import "./rightbar.css";
import solidity1 from "../images/solidity1.png";
import metamask from "../images/metamask.jpg";
import react from "../images/react.png";
import hardhat from "../images/hardhat.png";
import {Input} from '@web3uikit/core';
import { Search } from "@web3uikit/icons";

const Rightbar = () => {
  const trends = [
    {
      img: solidity1,
      text: "Master smart contract development",
      link: "#",
    },
    {
      img: metamask,
      text: "Learn how to use metamask",
      link: "#",
    },
    {
        img: hardhat,
        text: "Learn hardhat dev tool",
        link: "#",
    },
    {
        img: react,
        text: "Learn React.js to create frontend",
        link: "#",
      },
      
  ];
  return (
  <>
   <div className="rightbarContent">
    <Input label='search Twitter' name='search twitter' prefixIcon={<Search/>} labelBgColor="#141d26"></Input>
    <div className="trends">
        Trending
        {
            trends.map((e) => {
                return (
                    <>
                        <div className="trend" onClick={() => window.open(e.link)} >
                            <img src={e.img} className="trendImg"></img>
                            <div className="trendText">{e.text}</div>
                        </div>
                    </>
                )
            })
        }
    </div>
   </div>
  </>);
};

export default Rightbar;
