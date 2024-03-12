const { ObjectId } = require('mongodb');
const group = require('./../model/groupModel');
const mongoose = require('mongoose');

//Creates a new group, req may contain userids
exports.addNewGroup = async (req, resp, next)=>{
    console.log('Starting to create a new group for the user');
    const newGroup = new group();
    try {
        newGroup.groupName = req.body.groupName; //String
        newGroup.groupDescription = req.body.groupDescription; //String
        // const inputCreatedDate = req.body.createdDate; //Should be taken by default.. Can be considered from UI..
        newGroup.createdBy = req.body.createdBy; //ObjectID
        newGroup.notes = req.body.notes; //String
        newGroup.members = req.body.members; //Array of ObjectID
        console.log(`Saving newGroup object: ${newGroup}`)
                    const result = await newGroup.save(); //save method returns the whole document that is created...
                    resp.status(200).json({"message": "Group created successfully", "groupID": result._id});
    }
     catch (error) {
            console.log(`Error occurred while creating new group:\n${error}`);
        }
}

//Gets all groups that a user is part of
//req object should have a member/userID
exports.getUserGroups = async (req, resp, next)=>{
    //const userID = new mongoose.mongo.BSON.ObjectId(req.body.userid);
    const userID = req.body.userid; //Working as a String
    console.log(`Fetching groups for user ${userID}`);
    let results;
    try{
        results = await group.find({members: {$elemMatch: {$eq:userID}}}).exec();
        resp.status(200).json({"groups": results});
    } 
    catch (error){
        resp.status(500).json({"message": `Error occured while Fetching Group Details..\n${error}`});
    }
}

//Update a group to add a new user to the group
exports.addNewUserToGroup = async (req, resp, next) => {
    console.log('Adding a new user to existing group');
    const reqgroupID = req.body.groupId;
    const newUserID = req.body.newUserID;
    try {
        const result = await group.updateOne({_id: reqgroupID}, {$push:{members: newUserID}});
        resp.status(200).json({"message": `New Users added to the group. Modified count = ${result.modifiedCount}`});
    } catch (error) {
        resp.status(500).json({"message": `Error occured while Adding new user to the groups..\n${error}`});
    }
}