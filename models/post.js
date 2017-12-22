var mongodb = require('./db'),
    markdown = require('markdown').markdown,
    ObjectID = require('mongodb').ObjectID

function Post(author, title, tags, post){
    this.author = author
    this.title = title
    this.tags = tags
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
        author: this.author,
        time: time,
        title: this.title,
        tags: this.tags,
        post: this.post,
        comments: [],
        pv: 0
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
Post.getTen = function(author, page, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err)return callback(err)
        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            var query = {}
            if(author){
                query.author = author
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
Post.getOne = function(_id, callback){
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
                "_id": new ObjectID(_id)
            }, function(err, doc){
                if(err){
                    mongodb.close()
                    return callback(err)
                }
                if(doc){
                    //每访问一次，pv 值增加 1
                    collection.update({
                        "_id": new ObjectID(_id)
                    },{
                        $inc: {"pv": 1}
                    }, function(err){
                        mongodb.close()
                        if(err) return callback(err)
                    })
                    //解析 markdown 为 html
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
Post.edit = function(author, minute, title, callback){
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
                "author": author,
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
Post.update = function(author, minute, title, post, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err) return callback(err)
        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.updateOne({
                "author": author,
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
Post.remove = function(author, minute, title, callback){
    mongodb.open((err, db)=>{
        if(err) return callback(err)

        db.collection('post', (err, collection)=>{
            if(err) {
                mongodb.close()
                return callback(err)
            }
            collection.deleteOne({
                "author": author,
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

//获取全部文章存档
Post.getArchive = function(callback){
    //返回文章存档信息
    mongodb.open(function(err, db){
        if(err) return callback(err)

        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }

            collection.find({}, {
                "author": 1,
                "time": 1,
                "title": 1
            }).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close()
                if(err) return callback(err)
                
                callback(null, docs)
            })
        })
    })
}

//获取全部标签
Post.getTags = function(callback){
    mongodb.open(function(err, db){
        if(err) return callback(err)

        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.distinct('tags', function(err, docs){
                mongodb.close()
                if(err) return callback(err)

                callback(null, docs)
            })
        })
    })
}

Post.getTag = function(tag, callback){
    mongodb.open(function(err, db){
        if(err) return callback(err)

        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.find({
                "tags": tag
            },{
                "author": 1,
                "time": 1,
                "title": 1
            }).sort({
                "time": -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            })
        })
    })
}

Post.search = function(keyword, callback){
    mongodb.open(function(err, db){
        if(err) return callback(err)

        db.collection('post', function(err, collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            let patten = new RegExp(keyword, "i")
            collection.find({
                "title": patten
            },{
                "author": 1,
                "time": 1,
                "title": 1
            }).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close()
                if(err) return callback(err)

                callback(null, docs)
            })
        })
    })
}
