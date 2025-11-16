import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req,res){
  try {
    const currentUserId=req.user.id;
    const currentUser=req.user;

    const recommendedUsers=await User.find({
      $and:[
        {_id:{$ne:currentUserId}}, //dont count myself
        {_id:{$nin:currentUser.friends}}, // exclude my friends
        {isOnboarded:true}, //and are onboarded
      ],
    });

    res.status(200).json(recommendedUsers);

  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}

export async function getMyFriends(req,res){
  try {

    
    const user=await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");
    // want friends info therefore populate

    res.status(200).json(user.friends);

  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}

export async function sendFriendRequest(req,res){
  try {
    const myId=req.user.id;
    const {id:receiverId}=req.params;

    //dont want to send friend req to myself
    if(myId===receiverId){
      return res.status(400)
      .json({message:"You can't send friend request to yourself"});
    }

    //check if reciever exist or not
    const receiver=await User.findById(receiverId);
    if(!receiver){
      return res.status(404).json({message: "receiver not found"});
    }

    // check if already friends or not
    if(receiver.friends.includes(myId)){
      return res.status(400)
      .json({message:"You are already friends with this user"});
    }

    // check if already send friend request
    const existingRequest=await FriendRequest.findOne({
      $or:[
        {sender:myId,receiver:receiverId},
        {sender:receiverId,receiver:myId},
      ],
    });
    if(existingRequest){
      return res.status(400)
        .json({
            message:"A friend request already exists between you and this user" 
        });
    }

    const friendRequest=await FriendRequest.create({
      sender:myId,
      receiver:receiverId,
    });

    res.status(201).json(friendRequest);

  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}

export async function acceptFriendRequest(req,res){
  try {
    const {id:requestId}=req.params;

    const friendRequest=await FriendRequest.findById(requestId);

    if(!friendRequest){
      return res.status(404)
      .json({message:"Friend request not found"});
    }

    // Verify the current user is the receiver
    // is receiver is loggedin user only?
    if(friendRequest.receiver.toString()!==req.user.id) {
      return res.status(403)
      .json({ message: "You are not authorized to accept this request"});
    }

    friendRequest.status="accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // update user1 friends and add user2
    // update user2 friends and add user1
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender,{
      $addToSet:{friends:friendRequest.receiver},
    });

    await User.findByIdAndUpdate(friendRequest.receiver, {
      $addToSet:{friends:friendRequest.sender},
    });

    res.status(200).json({message:"Friend request accepted"});

  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}

export async function getFriendRequests(req,res) {
  try {

    const incomingReqs=await FriendRequest.find({
      receiver:req.user.id,
      status:"pending",
    }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs=await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("receiver","fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });

  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests=await FriendRequest.find({
      sender:req.user.id,
      status:"pending",
    }).populate("receiver","fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);

  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}