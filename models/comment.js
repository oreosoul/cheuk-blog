var mongodb = require('./db'),
    ObjectID = require('mongodb').ObjectID,
    async = require('async')

function Comment(_id, comment){
    this._id = _id
    this.comment = comment
}

module.exports = Comment

Comment.prototype.save = function(callback){
    //保存一条评论
    let _id = this._id
        comment = this.comment
    
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
            }, {$push:{"comments":comment}}, function(err){
                cb(err)
            })
        }
    ], function(err, result){
        mongodb.close()
        callback(err, result)
    })
}