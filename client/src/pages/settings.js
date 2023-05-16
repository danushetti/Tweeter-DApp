import React,{ useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {ethers,utils} from "ethers";
import "./settings.css";
import { Input, Upload, Loading, useNotification } from "@web3uikit/core";
import { Web3Storage } from "web3.storage";

const Settings = ({contract}) => {
  
  const notification = useNotification();
  const userName = JSON.parse(localStorage.getItem("userName"));
  const userBio = JSON.parse(localStorage.getItem("userBio"));
  const userImage = JSON.parse(localStorage.getItem("userImage"));
  const userBanner = JSON.parse(localStorage.getItem("userBanner"));

  const [profileFile, setProfileFile] = useState();
  const [bannerFile, setBannerFile] = useState();
  const [name, setName] = useState(userName);
  const [bio, setBio] = useState(userBio);
  const [loading, setLoading] = useState(false);
  let profileUploadedUrl = userImage;
  let bannerUploadedUrl = userBanner;

  async function storeFile (selectedFile) {
    const client = new Web3Storage({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAxYjlmMTJjYjIzODRiMjBjNjI1ODVDNjFFNDlhRWNjNDczNDE5QTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODQyMDA5OTU3NjMsIm5hbWUiOiJUd2l0dGVyIEFQSSJ9.1rdk7balAW5YEevUwsVA35K4DTAXQGqIYjxgXQnFvnc"});
    const rootCid = await client.put(selectedFile);
     const ipfsUploadedUrl = `https://${rootCid}.ipfs.dweb.link/${selectedFile[0].name}`;
    return ipfsUploadedUrl;
  }

  const bannerHandler = (event) => {
    if (event != null) {
      setBannerFile(event);
    }
  };

  const profileHandler = (event) => {
    if (event != null) {
      setProfileFile(event);
    }
  };
  
  // it rerenders the page whenever a loading state changes 
  useEffect(() =>{

  },[loading]);

  async function updateProfile(){
    setLoading(true);
    if(profileFile != null){
      let newprofileUploadedUrl = await storeFile([profileFile]);
      profileUploadedUrl = newprofileUploadedUrl;
     }

     if(bannerFile!= null){
      let newBannerUploadedUrl = await storeFile([bannerFile]);
      bannerUploadedUrl = newBannerUploadedUrl;
     }

     const transaction= await contract.updateUser(name,bio,profileUploadedUrl,bannerUploadedUrl);
     await transaction.wait();

     window.localStorage.setItem(
      "userName",
      JSON.stringify(name)
    );
    window.localStorage.setItem(
      "userBio",
      JSON.stringify(bio)
    );
    window.localStorage.setItem(
      "userImage",
      JSON.stringify(profileUploadedUrl)
    );
    window.localStorage.setItem(
      "userBanner",
      JSON.stringify(bannerUploadedUrl)
    );
    
    notification({
      type: 'success',
      title: 'profile updated successfully',
      position: 'topR'
    });

    setLoading(false);

  }

  return (
    <>
      <div className="settingsPage">
        <Input
          label="Name"
          name="NameChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setName(e.target.value)}
          value={userName}
        />
        <Input
          label="Bio"
          name="BioChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setBio(e.target.value)}
          value={userBio}
        />
        <div className="pfp">Change Profile Image</div>
        <Upload onChange={profileHandler} />
        <div className="pfp">Change Banner Image</div>
        <Upload onChange={bannerHandler} />
        {loading? <div className="save">loading</div> : <div className="save" onClick={updateProfile}>Save</div>}       
      </div>
    </>
  );
};

export default Settings;
