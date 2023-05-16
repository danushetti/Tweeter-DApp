import React from "react";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

//pages and components
import "./App.css";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Sidebar from "./components/sidebar";
import Rightbar from "./components/rightbar";

//components from web3uikit
import { Button, useNotification, Loading } from "@web3uikit/core";
import { Twitter, Metamask } from "@web3uikit/icons";
import axios from "axios";

//to interact with blockchain.
import { ethers, utils } from "ethers";
import Web3Modal from "web3modal";
import abi from "./Tweeter.json";
var toonavatar = require("cartoon-avatar");

//install: npm install ethers@5.7 react-router-dom @web3uikit/core @web3uikit/icons web3modal cartoon-avatar
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [provider, setProvider] = useState(window.ethereum);
  const [contract, setContract] = useState();
  const notification = useNotification();
  const [loading, setLoadingState] = useState(false);
  // const [signerAddress, setSignerAddress] = useState("");

  const warningNotification = () => {
    notification({
      type: "warning",
      message: "change network to polygon to visit this site",
      title: "switch to polygon network",
      position: "topR"
    });
  };

  const infoNotification = (accountNum) => {
    notification({
      type: "info",
      message: accountNum,
      title: "connected to Polygon Account",
      position: "topR"
    });
  };

  useEffect(() => {
    if (!provider) {
      window.alert("no metamask installed");
    }

    connectWallet();

    const handleAccountsChanged = (accounts) => {
      if (provider.chainId == "0x13881") {
        infoNotification(accounts[0]);
      }
      //just to prevet reloading twice for the very first time
      if (JSON.parse(localStorage.getItem("activeAccount")) != null) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    const handleChainChanged = (chainId) => {
      if (chainId != "0x13881") {
        warningNotification();
      }
      window.location.reload();
    };

    const handleDisconnect = () => {};

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);
    provider.on("disconnet", handleDisconnect);
  }, []);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    let provider = new ethers.providers.Web3Provider(connection);
    const getnetwork = await provider.getNetwork();
    const polygonChainId = 80001;

    if (getnetwork.chainId != polygonChainId) {
      warningNotification();

      try {
        await provider.provider
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: utils.hexValue(polygonChainId) }],
          })
          .then(() => window.location.reload());
      } catch (switchError) {
        //this error code indicates that the chain has not been added to metamask
        // so we'll add polygon network to metamask
        if (switchError.code === 4902) {
          try {
            await provider.provider
              .request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: utils.hexValue(polygonChainId),
                    chainName: "Polygon Testnet",
                    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
                    nativeCurrency: {
                      symbol: "MATIC",
                      decimals: 18,
                    }
                  }
                ]
              })
              .then(() => window.location.reload());
          } catch (addError) {
            throw addError;
          }
        }
      }
    } else {
      //it will execute if polygon chain is connected
      //here we will verify user exists of not in our blockcahin or else we will update
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const contract = new ethers.Contract(
        "0x4eA233E20CE783D9ce3EaEDA0d6F7c5A90CE3f20",
        abi.abi,
        signer
      );
     
      setContract(contract);
      const getUserDetail = await contract.getUser(signerAddress);

      if (getUserDetail['profileimg']) {
        //if user Exsists
        window.localStorage.setItem(
          "activeAccount",
          JSON.stringify(signerAddress)
        );
        window.localStorage.setItem(
          "userName",
          JSON.stringify(getUserDetail["name"])
        );
        window.localStorage.setItem(
          "userBio",
          JSON.stringify(getUserDetail["bio"])
        );
        window.localStorage.setItem(
          "userImage",
          JSON.stringify(getUserDetail["profileimg"])
        );
        window.localStorage.setItem(
          "userBanner",
          JSON.stringify(getUserDetail["profileBanner"])
        );
      } else {
        //first time user
        //get a random avatar and update in the contract
        setLoadingState(true);
        let avatar = toonavatar.generate_avatar();
        let defaultBanner = "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/RUU74ZL7GNDTFIM27G2QLC7ETQ.jpg";

        window.localStorage.setItem(
          "activeAccount",
          JSON.stringify(signerAddress)
        );
        window.localStorage.setItem(
          "userName",
          JSON.stringify('')
        );
        window.localStorage.setItem(
          "userBio",
          JSON.stringify('')
        );
        window.localStorage.setItem(
          "userImage",
          JSON.stringify('')
        );
        window.localStorage.setItem("userImage", JSON.stringify(avatar));
        window.localStorage.setItem(
          "userBanner",
          JSON.stringify(defaultBanner)
        );

        try {
          const transaction = await contract.updateUser(
            "danu",",",
            avatar,
            defaultBanner
          );
          await transaction.wait();
        } catch (error) {
          console.log(error);
          notification({
            type: "warning",
            message: "get test matic from polygon faucet",
            title: "require minimum 0.1 matic",
            position: "topR",
          });
  
          setLoadingState(false);
          return;
        }
      }

      

      setProvider(provider);
      setIsAuthenticated(true);
    }
  }
    return (
      <>
        {isAuthenticated ? (
          <div className="page">
            <div className="sideBar">
              <Sidebar />
            </div>
            <div className="mainWindow">
              <Routes>
                <Route path="/" element={<Home contract={contract}/>} />

                <Route path="/profile" element={<Profile  contract={contract} provider={provider} />} />

                <Route path="/settings" element={<Settings contract={contract}/>} />
              </Routes>
            </div>
            <div className="rightBar">
              <Rightbar />
            </div>
          </div>
        ) : (
          <div className="wallet">
            <Twitter fill="#ffffff" fontSize={110} className="tweetIcon" />
            {loading ? (
              <Loading size={50} spinnerColor="green" className="tweetIcon"/>
            ) : (
              <Button
                onClick={connectWallet}
                size="xl"
                text="Connect your Metamask wallet"
                theme="primary"
                icon={<Metamask />}
              />
            )}
          </div>
        )}
        ;
      </>
    );
  };

export default App;
