import React from "react";
import {useState, useRef} from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import "./home.css";
import {Avatar,Loading, useNotification} from '@web3uikit/core';
import {Image} from "@web3uikit/icons";
import { defaultImgs } from "../defaultimgs";
import TweetInfeed from "../components/tweetInfeed";
import {ethers} from "ethers";

import {Web3Storage} from "web3.storage";

const Home = ({contract}) => {
    
    const inputFile = useRef(null);
    const [selectedImage, setSelectedImage] =useState();
    const [tweetText, setTweetText] = useState('');
// to upload the image to web3.storage
    const userImage = JSON.parse(localStorage.getItem('userImage'));
    const [selectedFile, setSelectedFile] = useState();
    const [uploading, setUploading] = useState(false);
    let ipfsUploadedUrl ='';
    const notification = useNotification();

    //function to store the file on web3.storage
    async function storeFile() {
        //token = web3_Storage_API
        const client = new Web3Storage({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAxYjlmMTJjYjIzODRiMjBjNjI1ODVDNjFFNDlhRWNjNDczNDE5QTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODQyMDA5OTU3NjMsIm5hbWUiOiJUd2l0dGVyIEFQSSJ9.1rdk7balAW5YEevUwsVA35K4DTAXQGqIYjxgXQnFvnc"});
        const rootCid = await client.put(selectedFile);
        ipfsUploadedUrl = `https://${rootCid}.ipfs.dweb.link/${selectedFile[0].name}`;
    }
    
    //to target the <input/> that is invisible
    //on clicking the imgdiv it enable the user to select a file as an input
    //then calls the changehandler function, which sets the image selected 
    const onImageClick = () =>{
        inputFile.current.click();
    }
    
    //to retrive file(image ) from the input
    const changeHandler =(e) =>{
        const imgFile= e.target.files[0];
        setSelectedImage(URL.createObjectURL(imgFile));
        setSelectedFile(e.target.files)
        e.preventDefault();
    };

    //to add a tweet
    async function addTweet(){
        if(tweetText.trim().length < 5){
            notification({
                type: 'warning',
                message: 'minimum 5 characters',
                title: 'tweet field required',
                position: 'topR'
            });
            return;
        }
        setUploading(true);
        if(selectedImage){
            await storeFile();
        }
        // const web3Modal = new Web3Modal();
        // const connection = await web3Modal.connect();
        // const provider = new ethers.providers.Web3Provider(connection);
        const tweetValue = '0.01';
        const price = ethers.utils.parseEther(tweetValue);

        try{
           const transaction = await contract.addTweet(tweetText, ipfsUploadedUrl, {value:price});
           await transaction.wait();
           notification({
            type: 'success',
            title: 'tweet added successfully',
            position: 'topR'
           });

           setSelectedImage(null);
           setTweetText('');
           setSelectedFile(null);
           setUploading(false);
        }
        catch(e){
            notification({
                type: 'error',
                title: 'transaction error',
                message: e.message,
                position: 'topR'
            });
            setUploading(false);
        }
    }
    return (
        <>
          <div className="mainContent">
            <div className="profileTweet">
                <div className="tweetSection">
                    <Avatar isRounded image={userImage} theme="image" size={60}/>
                    <textarea  value ={tweetText} name ="TweetTxtArea" placeholder="what's going on?" className="textArea" onChange={(e) =>setTweetText(e.target.value)}></textarea>
                </div>
                <div className="tweetSection">

                    <div className="imgDiv" onClick={onImageClick}>
                      <input type="file" ref={inputFile} onChange={changeHandler} style={{display: "none"}}/>
                        {selectedImage ? <img src={selectedImage} width={150}/> :<Image fontSize ={25} fill ="#ffffff" /> }
                    </div>
                    <div className="tweet" onClick={addTweet}>{uploading? <Loading/> : 'Tweet'}</div>
                </div>
            </div>
            {/* feed section */}
            <TweetInfeed profile = {false} reload={uploading} contract={contract}/> 
         </div>
        </>
    )
}

export default Home;