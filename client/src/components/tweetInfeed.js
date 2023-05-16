import React, { useState, useEffect } from "react";
import "./tweetinfeed.css";
import { Avatar, Loading } from "@web3uikit/core";
import { MessageCircle, Matic, Bin, Calendar } from "@web3uikit/icons";
import { useNotification } from "@web3uikit/core";
//to interact with blockchain

const TweetInfeed = (props) => {
  const onlyUser = props.profile;
  let reloadComponent = props.reload;
  let contract = props.contract;

  const [tweets, setTweets] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const notification = useNotification();

  useEffect(() => {
    console.log(contract);
    if (onlyUser) {
      loadMyTweets();
    } else {
      loadAllTweets();
    }
  }, [reloadComponent]);

  const loadMyTweets = async () => {
    const data = await contract.getMyTweets();
    const userName = JSON.parse(localStorage.getItem("userName"));
    const userImage = JSON.parse(localStorage.getItem("userImage"));
    const result = await Promise.all(
      data.map(async (tweet) => {
        const unixTime = tweet.timestamp;
        const date = new Date(unixTime * 1000);
        const tweetDate = date.toLocaleDateString("fr-CH");

        let item = {
          tweeter: tweet.tweeter,
          id: tweet.id,
          tweetText: tweet.tweetText,
          tweetImg: tweet.tweetImg,
          isDeleted: tweet.isDeleted,
          userName: userName,
          userImage: userImage,
          date: tweetDate,
        };
        return item;
      })
    );

    setTweets(result.reverse());
    setLoadingState("loaded");
  };

  const loadAllTweets = async () => {
    const data = await contract.getAllTweets();
    console.log(data);
    const result = await Promise.all(
      data.map(async (tweet) => {
        const unixTime = tweet.timestamp;

        const date = new Date(unixTime * 1000);
        const tweetDate = date.toLocaleDateString("fr-CH");
        console.log("time", tweetDate);
        let getUserDetail = await contract.getUser(tweet.tweeter);
        console.log(getUserDetail);

        let item = {
          tweeter: tweet.tweeter,
          id: tweet.id,
          tweetText: tweet.tweetText,
          tweetImg: tweet.tweetImg,
          isDeleted: tweet.isDeleted,
          userName: getUserDetail["name"],
          userImage: getUserDetail["profileimg"],
          date: tweetDate,
        };

        console.log("itemssssss", item);
        return item;
      })
    );

    setTweets(result.reverse());
    console.log("all tweets", tweets, "tweets");
    setLoadingState("loaded");
  };

 const deleteTweet = async (id) => {
  console.log("deleting tweet", id);
    setLoadingState("not-loaded");
    const data = await contract.deleteTweet(id);
    await data.wait();
    notification({
      type: "success",
      title: "tweet deleted successfully",
      position: "topR",
      icon: <Bin/>
    });

    loadMyTweets();
  }

  if (loadingState == "not-loaded")
    return (
      <div className="loading">
        <Loading size={60} spinnerColor="#8247e5" />
      </div>
    );

  if (loadingState == "loaded" && !tweets.length)
    return <h1 className="loading">No tweet available</h1>;
  return (
    <>
      {tweets.map((tweet, i) => (
        <div className="feedTweet" key={i}>
          <Avatar isRounded image={tweet.userImage} theme="image" size={60} />
          <div className="completeTweet">
            <div className="who">
              {tweet.userName}
              <div className="accWhen">{tweet.tweeter}</div>
            </div>
            <div className="tweetContent">
              {tweet.tweetText}
              {tweet.tweetImg != "" && (
                <img src={tweet.tweetImg} className="tweetImg" />
              )}
            </div>
            <div className="interactions">
              <div className="interactionNums">
                <MessageCircle fontSize={20} />o
              </div>
              <div className="interactionNums">
                <Calendar fontSize={20} />
                {tweet.date}
              </div>
              {onlyUser ? (
                <div className="interactionNums">
                  <Bin
                    fontSize={20}
                    color="#FF0000"
                    onClick={() => deleteTweet(tweet.id)}
                  />
                </div>
              ) : (
                <div className="interactionNums">
                  <Matic fontSize={20} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default TweetInfeed;

// import React from 'react'
// import './tweetinfeed.css';
// import { defaultImgs } from '../defaultimgs';
// import { Avatar } from '@web3uikit/core';
// import { MessageCircle ,Star, Matic } from '@web3uikit/icons';

//  const TweetInfeed =()=> {
// const web3Modal =new Web3Modal();
// const connection = await web3Modal.connect();
// const provider = new ethers.providers.Web3Provider(connection);
// const signer = provider.getSigner();
// const contract = new ethers.Contract("0x4eA233E20CE783D9ce3EaEDA0d6F7c5A90CE3f20", abi.abi, signer);
// console.log(contract);
//   return (
//     <>
//       <div className='feedTweet'>
//         <Avatar isRounded image={defaultImgs[0]} theme='image' size={60}/>
//          <div className='completeTweet'>
//             <div className='who'>
//                 Elon Musk
//                 <div className='accWhen'>0x44121555521721212121</div>
//             </div>
//             <div className='tweetContent'>
//                 Nice day learning web3 from scratch
//                 <img src={defaultImgs[1]} className='tweetImg'/>
//             </div>
//             <div className='interactions'>
//                 <div className='interactionNums'><MessageCircle fontSize={20}/></div>
//                 <div className='interactionNums'><Star fontSize={20}/></div>
//                 <div className='interactionNums'><Matic fontSize={20}/></div>
//             </div>
//          </div>
//       </div>
//     </>
//   )
// }
// export default TweetInfeed;
