var ObjectID = require('mongodb').ObjectID,
    async = require('async'),
    mongoose = require('mongoose')

const userSchema  = new mongoose.Schema({
    name: String,
    password: String,
    email: String
},{
    collection: 'users'
})

//存储用户信息
userSchema.methods.register = function(callback){
    //要存入数据库的用户文档
    this.save((err, user)=>{
        if(err){
            return callback(err)
        }
        callback(null, user)
    })
}

/* 读取用户信息 */
userSchema.statics.get = function(name, callback){
    this.findOne({
        "name": name
    },(err, user) => {
        if(err){
            return callback(err)
        }
        callback(null, user)
    })
}

var User = mongoose.model('User', userSchema)

module.exports = User
