const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventsSchema = new Schema(
    {
        _id:{
            type:String,
            required:true,
        },
        title: {
            type: String,
            required: true,
        },
        start:{
            type:String,
            required:true
        },
        end:{
            type:String,
            required:true
        },
        objectType:{
            type:String,
            enum:["event"],
            required:true
        },
        clientId:{
            type:String,
            required:true
        },
        ownerId:{
            type:String,
            required:true
        }
    },
    {  collection: 'users'  }
);

const events = mongoose.model("events", eventsSchema);

module.exports = events;
