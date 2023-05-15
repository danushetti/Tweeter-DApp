// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Tweeter {
    address payable public owner;
    uint256 private counter;

    constructor() {
        owner = payable(msg.sender);
    }

    struct tweet {
        address tweeter;
        uint256 id;
        string tweetText;
        string tweetImg;
        bool isDeleted;
        uint256 timestamp;
    }

    struct user {
        string name;
        string bio;
        string profileimg;
        string profileBanner;
    }

    mapping(uint256 => tweet) public tweets; // id to tweet
    mapping(address => user) public users;
    
    event tweetCreated(
        address tweeter,
        uint256 id,
        string tweetText,
        string tweetImg,
        bool isDeleted,
        uint256 timestamp
    );

    event tweetDeleted(string tweetText, string tweetImg);

    function addTweet(
        string memory _tweetText,
        string memory _tweetImg
    ) external  payable {
        require(msg.value == (0.01 ether), "please submit 0.01 matic");
        tweet memory newTweet = tweet({
            tweeter: msg.sender,
            id: counter,
            tweetText: _tweetText,
            tweetImg: _tweetImg,
            isDeleted: false,
            timestamp: block.timestamp
        });
        tweets[counter++] = newTweet;
        
        emit tweetCreated(
            msg.sender,
            counter,
            _tweetText,
            _tweetImg,
            false,
            block.timestamp
        );
        payable(owner).transfer(msg.value);
    }


    function getAllTweets() external view returns(tweet[] memory) {
        tweet[] memory temp = new tweet[](counter);
        uint256 count=0;

        for(uint256 i = 0; i < counter; i++) {            
            if (tweets[i].isDeleted == false) {
                temp[count++]= tweets[i];
            }
        }
        
        tweet[] memory result = new tweet[](count);
        for(uint i=0; i<= count; i++){
            result[i] = temp[i];
         }

         return result;
    }


    //to get tweets of a particular user.
    function getMyTweets() external view returns(tweet[] memory){
         tweet[] memory temp = new tweet[](counter);
        uint256 count=0;

        for(uint256 i = 0; i < counter; i++) {            
            if (tweets[i].isDeleted == false && tweets[i].tweeter == msg.sender) {
                temp[count++]= tweets[i];
            }
        }
        
        tweet[] memory result = new tweet[](count);
        for(uint i=0; i<= count; i++){
            result[i] = temp[i];
         }

         return result;
    }


    function deleteTweet(uint256 _id) external  {
        require(tweets[_id].tweeter == msg.sender,"only the tweeter can delete the tweet");
        tweets[_id].isDeleted= false;
        emit tweetDeleted(tweets[_id].tweetText, tweets[_id].tweetImg);
    }

    function updateUser(string memory _name,
        string memory _bio,
        string memory _profileimg,
        string memory _profileBanner) external {     
            user memory userData = user({ name: _name, bio: _bio, profileimg: _profileimg, profileBanner: _profileBanner});
            users[msg.sender]= userData;
        }

    function getUser(address userAddress) external view returns(user memory){
        return users[userAddress];
    }
}
