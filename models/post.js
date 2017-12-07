var mongodb = require('./db'),
    markdown = require('markdown').markdown

function Post(name, title, post){
    this.name = name
    this.title = title
    this.post = post
}

module.exports = Post

Post.prototype.save = function(callback){
    var date = new Date()
    //存储各种时间格式，方便扩展
    var time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
    }

    //需要插入collection的document
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post
    }

    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err)
        }
        //读取集合
        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            //将文档插入post集合
            collection.insert(post, {
                safe: true
            }, function(err){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                callback(null)
            })
        })
    })
}

//读取文章信息
Post.get = function(name, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err)return callback(err)
        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            var query = {}
            if(name){
                query.name = name
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                docs.forEach(function (doc) {
                    if(doc.post){
                        doc.post = markdown.toHTML(doc.post);
                    }else{
                        doc.post = markdown.toHTML('');
                    }
                });
                callback(null, docs)
            })
        })
    })
}