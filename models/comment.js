var mongodb = require('./db')

function Comment(name, minute, title, comment){
    this.name = name
    this.minute = minute
    this.title = title
    this.comment = comment
}

module.exports = Comment

Comment.prototype.save = function(callback){
    //保存一条评论
    let name = this.name,
        minute = this.minute,
        title = this.title,
        comment = this.comment
    
    //打开数据库
    mongodb.open(function(err, db){
        if(err) return callback(err)
        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            //通过用户名，时间和标题查找指定文章
            collection.updateOne({
                "name": name,
                "time.minute": minute,
                "title": title
            }, {$push:{"comments":comment}}, function(err){
                mongodb.close()
                if(err) return callback(err)
                return callback(null)
            })
        })
    })
}