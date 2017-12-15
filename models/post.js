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
        post: this.post,
        comments: []
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
Post.getTen = function(name, page, callback){
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
            collection.count(query,function(err, total){
                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                collection.find(query)
                .skip((page-1)*10)
                .limit(10)
                .sort({
                    time: -1
                }).toArray(function(err, docs){
                    mongodb.close()
                    if(err){
                        return callback(err)
                    }
                    docs.forEach(function (doc) {
                        doc.post = doc.post?doc.post:''
                        doc.post = markdown.toHTML(doc.post);
                    });
                    callback(null, docs, total)
                })
            })
        })
    })
}

//获取一篇文章
Post.getOne = function(name, minute, title, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err)
        }
        //读取 posts 集合
        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            //根据信息查询文章
            collection.findOne({
                "name": name,
                "time.minute": minute,
                "title": title
            }, function(err, doc){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                if(doc){
                    doc.post = doc.post?doc.post:''
                    doc.post = markdown.toHTML(doc.post);
                    doc.comments.forEach(function(comment){
                        comment.content = markdown.toHTML(comment.content);
                    })
                }
                callback(null, doc)
            })

        })
    })
}

//返回文章的markDown内容
Post.edit = function(name, minute, title, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err)
        }
        //读取POST集合
        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            //查找指定文章
            collection.findOne({
                "name": name,
                "time.minute": minute,
                "title": title
            }, function(err, doc){
                mongodb.close()
                if(err){
                    callback(err)
                }
                callback(null, doc);//返回查询的一篇文章（markdown 格式）
            })
        })
    })
}

//更新文章相关信息
Post.update = function(name, minute, title, post, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err) return callback(err)
        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.updateOne({
                "name": name,
                "time.minute": minute,
                "title": title
            },{$set:{
                "post": post
            }}, function(err){
                mongodb.close()
                if(err) return callback(err)
                return callback(null)
            })
        })
    })
}
Post.remove = function(name, minute, title, callback){
    mongodb.open((err, db)=>{
        if(err) return callback(err)

        db.collection('post', (err, collection)=>{
            if(err) {
                mongodb.close()
                return callback(err)
            }
            collection.deleteOne({
                "name": name,
                "time.minute": minute,
                "title": title
            }, (err)=>{
                mongodb.close()
                if(err) return callback(err)
                return callback(null)
            })

        })
    })
}

