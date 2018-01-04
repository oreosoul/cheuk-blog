var mongodb = require('./db'),
    ObjectID = require('mongodb').ObjectID,
    async = require('async')

/* User 构造函数 */
function User(user) {
    this.name = user.name
    this.password = user.password
    this.email = user.email
};

//存储用户信息
User.prototype.save = function(callback){
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    }
    async.waterfall([
        function(cb){
            //打开数据库
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            // 查找集合
            db.collection('users', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            // 查找文档
            collection.insertOne(user, {safe: true}, function(err, res){
                cb(err, res.ops[0])
            })
        }
    ], function(err, result){
        mongodb.close()
        callback(err, result)
    })
}

/* 读取用户信息 */
User.get = function(name, callback){
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('users', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            collection.findOne({"name": name}, function(err, user){
                cb(err, user)
            })
        }
    ], function(err, result){
        mongodb.close()
        callback(err, result)
    })
}

module.exports = User
