var mongodb = require('./db'),
    markdown = require('markdown').markdown,
    ObjectID = require('mongodb').ObjectID,
    async = require('async'),
    mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author: String,
    time: {},
    title: String,
    tags: Array,
    post: String,
    pv: Number
},{
    collection: 'post'
})

// function Post(author, title, tags, post){
//     this.author = author
//     this.title = title
//     this.tags = tags
//     this.post = post
// }

postSchema.methods.savePost = function(callback){
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
    this.time = time
    this.save(function(err){
        if(err) return callback(err)

        return callback(null)
    })
}

//读取文章信息
postSchema.statics.getTen = function(author, page, callback){
    async.waterfall([
        function(cb){
            if(author){
                query.author = author
            }
            this.count(query,function(err, total){
                cb(err, total, query)
            })
        },
        function(total, query, cb){
            this.find(query).skip((page-1)*10)
            .limit(10)
            .sort({
                time: -1
            }).toArray(function(err, docs){
                docs.forEach(function (doc) {
                    doc.post = doc.post?doc.post:''
                    doc.post = markdown.toHTML(doc.post);
                });
                cb(err, docs, total)
            })
        }
    ], function(err, docs, total){
        mongodb.close()
        callback(err, docs, total)
    })
}

//获取一篇文章
postSchema.statics.getOne = function(_id, callback){
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('post', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            collection.findOne({
                "_id": new ObjectID(_id)
            }, function(err, doc){
                cb(err, doc, collection)
            })
        },
        function(doc, collection, cb){
            if(doc){
                //解析 markdown 为 html
                doc.post = doc.post?doc.post:''
                doc.post = markdown.toHTML(doc.post);
                //每访问一次，pv 值增加 1
                collection.update({
                    "_id": new ObjectID(_id)
                },{
                    $inc: {"pv": 1}
                }, function(err){
                    cb(err, doc)
                })
            }
        }
    ],function(err, result){
        mongodb.close()
        callback(err, result)
    })
}

//返回文章的markDown内容
postSchema.statics.edit = function(_id, callback){
    //打开数据库
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('post', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            collection.findOne({
                "_id": new ObjectID(_id)
            }, function(err, doc){
                cb(err, doc)
            })
        }
    ],function(err, post){
        mongodb.close()
        callback(err, post)
    })
}

//更新文章相关信息
postSchema.statics.update = function(_id, post, callback){
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('post', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            collection.updateOne({
                "_id": new ObjectID(_id)
            }, {$set:{
                "post": post
            }}, function(err){
                cb(err)
            })
        }
    ],function(err, result){
        mongodb.close()
        callback(err, result)
    })
}
postSchema.statics.remove = function(_id, callback){
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('post', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            collection.deleteOne({
                "_id": new ObjectID(_id)
            }, function(err, doc){
                cb(err, doc)
            })
        }
    ],function(err, post){
        mongodb.close()
        callback(err, post)
    })
}

//获取全部文章存档
postSchema.statics.getArchive = function(callback){
    //返回文章存档信息
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('post', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            collection.find({},{
                "author": 1,
                "time": 1,
                "title": 1
            }).sort({
                time: -1
            }).toArray(function(err, docs){
                cb(err, docs)
            })
        }
    ],function(err, posts){
        mongodb.close()
        callback(err, posts)
    })
}

//获取全部标签
postSchema.statics.getTags = function(callback){
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('post', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            collection.distinct('tags', function(err, docs){
                cb(err, docs)
            })
        }
    ], function(err, tags){
        mongodb.close()
        callback(err, tags)
    })
}

postSchema.statics.getTag = function(tag, callback){
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('post', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            collection.find({
                "tags": tag
            },{
                "author": 1,
                "time": 1,
                "title": 1
            }).sort({
                "time": -1
            }).toArray(function(err, docs){
                cb(err, docs)
            })
        }
    ], function(err, posts){
        mongodb.close()
        callback(err, posts)
    })
}

postSchema.statics.search = function(keyword, callback){
    async.waterfall([
        function(cb){
            mongodb.open(function(err, db){
                cb(err, db)
            })
        },
        function(db, cb){
            db.collection('post', function(err, collection){
                cb(err, collection)
            })
        },
        function(collection, cb){
            let patten = new RegExp(keyword, "i")
            collection.find({
                "title": patten
            },{
                "author": 1,
                "time": 1,
                "title": 1
            }).sort({
                "time": -1
            }).toArray(function(err, docs){
                cb(err, docs)
            })
        }
    ], function(err, posts){
        mongodb.close()
        callback(err, posts)
    })
}

let Post = new mongoose.model('Post', postSchema)

module.exports = Post