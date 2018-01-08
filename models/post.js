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
    this.save((err) => {
        if(err) return callback(err)

        return callback(null)
    })
}

//读取文章信息
postSchema.statics.getTen = function(author, page, callback){
    let query = {}
    async.waterfall([
        (cb) => {
            if(author){
                query.author = author
            }
            this.count(query,function(err, total){
                cb(err, total, query)
            })
        },
        (total, query, cb) => {
            this.find(query, null , {
                skip: (page-1)*10,
                limit: 10,
                sort: {time: -1}
            }, (err, docs) => {
                docs.forEach((doc) => {
                    doc.post = doc.post?doc.post:''
                    doc.post = markdown.toHTML(doc.post);
                });
                cb(err, docs, total)
            })
        }
    ], function(err, docs, total){
        callback(err, docs, total)
    })
}

//获取一篇文章
postSchema.statics.getOne = function(_id, callback){
    this.findByIdAndUpdate(new ObjectID(_id), {
        $inc: {"pv": 1}
    }, (err, doc) => {
        callback(err, doc)
    })
}

//返回文章的markDown内容
postSchema.statics.edit = function(_id, callback){
    this.findOne({
        "_id": new ObjectID(_id)
    }, (err, post) => {
        callback(err, post)
    })
}

//更新文章相关信息
postSchema.statics.update = function(_id, post, callback){
    this.updateOne({
        "_id": new ObjectID(_id)
    }, {$set:{
        "post": post
    }}, (err) => {
        callback(err)
    })
}
postSchema.statics.remove = function(_id, callback){
    this.deleteOne({
        "_id": new ObjectID(_id)
    }, (err, doc) => {
        callback(err, doc)
    })
}

//获取全部文章存档
postSchema.statics.getArchive = function(callback){
    //返回文章存档信息
    this.find({},{
        "author": 1,
        "time": 1,
        "title": 1
    }, {
        sort: {time: -1}
    }, (err, docs) => {
        callback(err, docs)
    })
}

//获取全部标签
postSchema.statics.getTags = function(callback){
    this.distinct('tags', function(err, docs){
        callback(err, docs)
    })
}

postSchema.statics.getPostsByTag = function(tag, callback){
    this.find({
        "tags": tag
    }, {
        "author": 1,
        "time": 1,
        "title": 1
    }, {
        sort: {time: -1}
    }, (err, docs) => {
        callback(err, docs)
    })
}

postSchema.statics.search = function(keyword, callback){
    let patten = new RegExp(keyword, "i")
    this.find({
        "title": patten
    }, {
        "author": 1,
        "time": 1,
        "title": 1
    }, {
        sort: {time: -1}
    }, (err, posts) => {
        callback(err, posts)
    })
}

var Post = mongoose.model('Post', postSchema)
module.exports = Post