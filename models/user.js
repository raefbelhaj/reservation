// Create model of user 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    id : mongoose.Schema.ObjectId,
    email:{type:String,unique:true},
    username : String,
    phone : Number,
    password:String
});

userSchema.pre('save', async function(next){
    const user =this;
    if (user.isModified('password')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;