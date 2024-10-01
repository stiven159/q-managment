const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ownersSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        avatar:{
            type:String,
            required:false
        },
        objectType:{
            type:String,
            enum:["owner"],
            required:true
        },
        description:{
            type:String,
            required:false
        }
    },
    {  collection: 'users'  }
);

const owners = mongoose.model("owners", ownersSchema);

module.exports = owners;
