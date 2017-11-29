var mongodb = require('./db');

/* User 构造函数 */
function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

//存储用户信息
User.prototype.save = function(callback){
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    }
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err)//出错，返回错误信息
        }
        //读取 users 集合
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)//出错，返回错误信息
            }
            //将数据插入集合
            collection.insert(user, {
                safe: true
            },function(err, user){
                mongodb.close()
                if(err){
                    return callback(err)//出错，返回错误信息
                }
                callback(null, user[0])//成功！ err为null，并返回储存后的用户文档
            })
        })
    })
}

/* 读取用户信息 */
User.get = function(name, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err)
        }
        //读取users集合
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.findOne({name: name},function(err, user){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                callback(null, user)
            })
        })
    })
}

module.exports = User
