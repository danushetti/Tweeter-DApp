import React from "react";
import {useState, useRef} from "react";
import {Link} from "react-router-dom";
import "./home.css";
import {Avatar} from '@web3uikit/core';
import {Image} from "@web3uikit/icons";
import { defaultImgs } from "../defaultimgs";
import TweetInfeed from "../components/tweetInfeed";

const Home = () => {

    const inputFile = useRef(null);
    const [selectedImage, setSelectedImage] =useState();
    const [tweetText, setTweetText] = useState('');
    
    //to target the <input/> that is invisible
    //on clicking the imgdiv it enable the user to select a file as an input
    //then calls the changehandler function, which sets the image selected 
    const onImageClick = () =>{
        inputFile.current.click();
    }

    const changeHandler =(e) =>{
        const imgFile= e.target.files[0];
        setSelectedImage(URL.createObjectURL(imgFile));
    }

    return (
        <>
          <div className="mainContent">
            <div className="profileTweet">
                <div className="tweetSection">
                    <Avatar isRounded image={defaultImgs[0]} theme="image" size={60}/>
                    <textarea name ="TweetTxtArea" placeholder="what's going on?" className="textArea" onChange={(e) =>setTweetText(e.target.value)}></textarea>
                </div>
                <div className="tweetSection">

                    <div className="imgDiv" onClick={onImageClick}>
                      <input type="file" ref={inputFile} onChange={changeHandler} style={{display: "none"}}/>
                        {selectedImage ? <img src={selectedImage} width={150}/> :<Image fontSize ={25} fill ="#ffffff" /> }
                    </div>
                    <div className="tweet">Tweet</div>
                </div>
            </div>
            {/* feed section */}
            <TweetInfeed profile = {false}/> 
         </div>
        </>
    )
}

export default Home;