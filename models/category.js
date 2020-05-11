const mongoose = require('mongoose');
const Shcema = mongoose.Schema;
const categorySchema = new Shcema ({
    name:{
        type:String,
        required:true,
    },
})

const Category = mongoose.model("Category",categorySchema);


module.exports = Category;