var crypto = require('crypto'),
    User = require('../models/user'),
    Post = require('../models/post'),
    Comment = require('../models/comment'),
    mongoose = require('mongoose')

var Promise = mongoose.connect('mongodb://localhost/blog', {
    useMongoClient: true
    /* other options */
    })
var db = mongoose.connection

db.on('error', console.error.bind(console, '连接错误:'))
db.once('open', function() {
    console.log('连接成功')
})

module.exports = function (app) {
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
        res.header("Access-Control-Allow-Headers","content-type")
        next();
    });
    app.post('/Post/getPostList', function(req, res){
        Post.getPostList (req.body.limit, req.body.page, function(err, posts, total){
            let articleList = []
            if(err){
                res.send({
                    code: 400,
                    data: null,
                    msg: `Get post list fail: ${err}.`
                })
            }
            articleList = posts.map(post => {
                let postPreViewStr =  post.post.match(/<p>[^<img].*?<\/p>/)[0],
                    imageStr = post.post.match(/<img.*?\/>/)
                if(imageStr) imageStr = imageStr[0]/* .replace('src="', 'src="//localhost:3000') */
                return {
                    _id: post._id,
                    title: post.title,
                    post: postPreViewStr,
                    time: post.time.minute,
                    tags: post.tags,
                    image: imageStr
                }
            })
            res.send({
                code: 200,
                data: {
                    articleList: articleList,
                    total: total
                },
                msg: 'Get post list success.'
            })
        })
    })
    app.get('/Post/getPostById', function(req, res){
        Post.getOne(req.query._id, function(err, post){
            if(err){
                res.send({
                    code: 400,
                    data: null,
                    msg: `Get article list fail: ${err}.`
                })
            }
            res.send({
                code: 200,
                data: {article: post},
                msg: 'Get article success.'
            })
        })
    })





    app.get('/', function (req, res) {
        //判断是否第一页，并把请求的页数转换成 number 类型
        let page = req.query.p ? parseInt(req.query.p) : 1
        Post.getTen (null, page, function(err, posts, total){
            if(err){
                posts = []
            }
            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts: posts,
                page: page,
                isFirstPage: (page - 1) === 0,
                isLastPage: ((page - 1) * 10 + posts.length) === total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        })
    });

    /* 注册页面 */
    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat']
        
        //检验密码校验是否一致
        if(password_re != password){
            req.flash('error', '两次输入不一致!')
            return res.redirect('/reg')//返回注册页
        }
        //生成密码md5
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex')
        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email
        })
        //检查用户名是否存在
        User.get(newUser.name, function(err, user){
            if(err){
                req.flash('error', err)
                return res.redirect('/')
            }
            if(user){
                req.flash('error', '用户已存在！')
                return res.redirect('/reg')
            }
            //如果不存在
            newUser.register(function(err, user){
                if(err){
                    req.flash('error', err)
                    return res.redirect('reg')
                }
                req.session.user = user
                req.flash('success', '注册成功!')
                res.redirect('/')//注册成功跳转主页
            })
        })
    });

    /* 登录页面 */
    app.get('/login', checkNotLogin)
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', checkNotLogin)
    app.post('/login', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex')
        User.get(req.body.name, function(err, user){
            if (!user) {
                req.flash('error', '用户不存在!')
                return res.redirect('/login')
            }
            if (user.password != password) {
                req.flash('error', '密码错误!')
                return res.redirect('/login')
            }
            req.session.user = user;
            req.flash('success', '登陆成功!')
            res.redirect('/');
        })
    });

    /* 发表页面 */
    app.get('/post', checkLogin)
    app.get('/post', function (req, res) {
        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', checkLogin)
    app.post('/post', function (req, res) {
        var currentUser = req.session.user,
            tags = [req.body.tag1, req.body.tag2, req.body.tag3],
            newPost = new Post({
                author: currentUser.name,
                title: req.body.title,
                tags: tags, 
                post: req.body.post,
                pv: 0,
                time: {}
            })
            newPost.savePost(function(err){
            if(err){
                req.flash('error', err)
                return res.redirect('/')
            }
            req.flash('success', '发布成功!')
            res.redirect('/')
        })
    });

    /* 注销请求 */
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!')
        res.redirect('/')
    });
    
    //上传图片
    app.get('/upload', checkLogin);
    app.get('/upload', function (req, res) {
        res.render('upload', {
            title: '文件上传',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    })
    app.post('/upload', checkLogin);
    app.post('/upload', function (req, res) {
      req.flash('success', '文件上传成功!')
      res.redirect('/upload')
    })


    app.get('/u/:name', checkLogin);
    app.get('/u/:name', function(req, res){
        let page = req.query.p ? parseInt(req.query.p) : 1
        //检查用户是否存在
        User.get(req.params.name, function(err, user){
            if (!user) {
                req.flash('error', '用户不存在!')
                return res.redirect('/') //用户不存在跳回主页
            }
            //查询并返回该用户的10篇文章
            Post.getTen(user.name, page, function(err, posts, total){
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/')
                }
                res.render('user', {
                    title: user.name,
                    posts: posts,
                    page: page,
                    isFirstPage: (page - 1) === 0,
                    isLastPage: ((page - 1) * 10 + posts.length) === total,
                    user : req.session.user,
                    success : req.flash('success').toString(),
                    error : req.flash('error').toString()
                })
            })
        })
    })
    //获取文章页面
    // app.get('/p/:_id', checkLogin);
    app.get('/p/:_id', function(req, res){
        //检查用户是否存在
        Post.getOne(req.params._id, function(err, post){
            if(err){
                req.flash('error', err); 
                return res.redirect('/');
            }
            res.render('article', {
                title: post.title,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    })

    app.get('/edit/:_id', checkLogin)
    app.get('/edit/:_id', function(req, res){
        Post.edit(req.params._id, function(err, post){
            if(err){
                req.flash('error', err)
                return res.redirect('/')
            }
            res.render('edit', {
                title: '编辑',
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    })
    app.post('/edit/:_id', checkLogin)
    app.post('/edit/:_id', function(req, res){
        Post.update(req.params._id, req.body.post, function(err){
            let url = encodeURI('/p/' + req.params._id);
            if(err){
                req.flash('error', err)
                return res.redirect(url)
            }
            req.flash('success', '修改成功!');
            res.redirect(url);//成功！返回文章页

        })
    })
    app.get('/remove/:_id', checkLogin)
    app.get('/remove/:_id', function(req, res){
        Post.remove(req.params._id, function(err){
            if(err){
                req.flash('error', err)
                return res.redirect('back')
            }
            req.flash('success', '删除成功!')
            res.redirect('/')
        })
    })
    
    //存档页面
    app.get('/archive', function(req, res){
        Post.getArchive(function(err, posts){
            if(err){
                req.flash('error', err)
                return res.redirect('/')
            }
            res.render('archive', {
                title: '存档',
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    })

    //获取全部标签页面
    app.get('/tags',function(req, res){
        Post.getTags(function(err, tags){
            if(err){
                req.flash('error', err)
                return res.redirect('/')
            }
            res.render('tags', {
                title: '标签',
                tags: tags,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    })
    //获取指定标签页面
    app.get('/tags/:tag',function(req, res){
        Post.getPostsByTag(req.params.tag, function(err, posts){
            if(err){
                req.flash('error', err)
                return res.redirect('/')
            }
            res.render('tag', {
                title: 'tag' + req.params.tag,
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    })

    app.get('/search', function(req, res){
        Post.search(req.query.keyword, function(err, posts){
            if(err){
                req.flash('error', err)
                return res.redirect('/')
            }
            res.render('search', {
                title: 'SEARCH' + req.query.keyword,
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    })

    app.get('/links', function(req, res){
        res.render('links', {
            title: '友情链接',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    })

    app.use(function(req, res){
        res.render('404',{
            title: 'ERROR: 404',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    })
    function checkLogin(req, res, next){
        if(!req.session.user){
            req.flash('error', '未登录')
            res.redirect('/login')
        }
        next()
    }

    function checkNotLogin(req, res, next){
        if(req.session.user){
            req.flash('error', '已登录！')
            res.redirect('back')
        }
        next()
    }
};


