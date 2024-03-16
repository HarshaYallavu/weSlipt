const { Types } = require('mongoose');
const orderModel = require('./../model/orderModel');

//Get all orders that are tagged to a Group
//Request object contains groupId
//Response should include array of orders that are present under the group
exports.getAllOrdersForAGroup = async (req, resp, next) => {
    const requestedGroupId = req.body.groupId;
    console.log(`Getting all orders for the Group ID = ${requestedGroupId}`);
    const order = new orderModel.orderModel();
    const fetchedOrders = await order.find({ groupId: { $eq: requestedGroupId } });
    console.log(fetchedOrders);
    resp.send(fetchedOrders);
}

//Allows user to claim an order item
//Request object contains claimedby userid, quantity, calculated price share, along with filter conditions orderId and itemName
//Response object contains a success/validation failure/failure message
//Supports only one item claim at a time
exports.makeAClaimForAnOrderItemBulk = async (req, resp, next) => {
    const claimedOrderId = req.body.orderId;
    const claimedUserId = req.body.userId;
    const itemsClaimed = req.body.orderItemClaims;
    const order = orderModel.orderModel;
    try {
        const bulkwriteQueries = await checkForClaims(claimedOrderId, claimedUserId, itemsClaimed, order);
        // console.log(bulkwriteQueries);
        const bulkUpdateStats = await order.bulkWrite(bulkwriteQueries);
        console.log(bulkUpdateStats);
        resp.status(200).json({ "message": `Successfully updated claim on the Order# ${claimedOrderId}` });
    } catch (error) {
        resp.status(500).json({ "message": `Error occurred while claiming the order item:\n${error}` });
    }
}

//Create an order 
//req object is expected to have all order details and resp obj contains a message and the order results, the object that is saved
exports.createAnOrder = async (req, resp, next) => {
    console.log('Creating an order');
    try {
        const orderObj = new orderModel.orderModel();
        orderObj.invoiceOrderId = req.body.invoiceOrderId;
        orderObj.groupId = req.body.groupId;
        orderObj.items = req.body.itemsList;
        const orderResults = await orderObj.save();
        // console.log(orderResults);
        resp.status(200).json({ 'message': 'Successfully Saved the order details', 'data': orderResults });
    } catch (error) {
        resp.status(500).json({ 'message': `Error while saving order details\n${error}` });
    }
}


//This method checks for the claims and returns the update query to bulk write
async function checkForClaims(orderId, userId, itemsClaimed, order) {
    const bulkUpdateOps = [];
    try {
        for (const index in itemsClaimed) {
            const userAlreadyClaimedTheItem = await order.aggregate([
                { $match: { _id: new Types.ObjectId(orderId) } }, // check for a different way to handle ObjectId typecasting
                { $unwind: { path: "$items" } },
                { $match: { "items.itemName": itemsClaimed[index].itemName } },
                { $unwind: { path: "$items.claims" } },
                { $match: { "items.claims.claimedBy": new Types.ObjectId(userId) } },
                { $project: { items: 1 } }]).exec();
            console.log(userAlreadyClaimedTheItem);
            if (userAlreadyClaimedTheItem.length == 0) {
                console.log('user not claimed'); //make update query for claimed item
                bulkUpdateOps.push(
                    {
                        updateOne: {
                            filter: { _id: orderId, "items.itemName": itemsClaimed[index].itemName },
                            update: { $push: { "items.$.claims": { claimedBy: new Types.ObjectId(userId), claimedQuantity: itemsClaimed[index].quantity, claimedPriceShare: itemsClaimed[index].priceShare } } },
                            upsert: true
                        }
                    }
                );
            }
            else {
                console.log('user claimed'); //make query for claim push
                bulkUpdateOps.push(
                    {
                        updateOne: {
                            filter: { _id: orderId },
                            update: {
                                $set: {
                                    "items.$[item].claims.$[claim]": { claimedBy: new Types.ObjectId(userId), claimedQuantity: itemsClaimed[index].quantity, claimedPriceShare: itemsClaimed[index].priceShare },
                                }
                            },
                            arrayFilters: [{ "claim.claimedBy": new Types.ObjectId(userId) }, { "item.itemName": itemsClaimed[index].itemName }],
                            upsert: true
                        }

                    }
                );
            }
        }
        return bulkUpdateOps;
    } catch (error) {
        console.log(`Error while checking for claims:\n${error}`);
        return [];
    }
}