const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/newPost', (req, res) => {
        if(!req.body.title){
            res.json({success: false, message: 'Title is required.'});
        }else if(!req.body.body){
            res.json({success: false, message: 'Body is required.'});       
        }else if(!req.body.createdBy){
            res.json({success: false, message: 'CreatedBy is required.'});            
        }else{
            const blog = new Blog({
                title: req.body.title,
                body: req.body.body,
                createdBy: req.body.createdBy
            });
            blog.save((err) => {
                if(err){
                    if(err.errors){
                        if(err.errors.title){
                            res.json({ success: false, message: err.errors.title.message});
                        }else if(err.errors.body){
                            res.json({ success: false, message: err.errors.body.message}); 
                        }else if(err.errors.createdBy){
                            res.json({ success: false, message: err.errors.createdBy.message}); 
                        }else{
                            res.json({ success: false, message: err});
                        }
                    }else{
                        res.json({ success: false, message: err});
                    }
                }else{
                    res.json({ success: true, message: "Blog created!"});
                }
            });
        }
    });

    router.get('/allBlogs', (req, res)=>{
        Blog.find({}, (err, blogs) => {
            if(err){
                res.json({ success: false, message: err});
            }else{
                if(!blogs){
                    res.json({ success: false, message: "No blogs found"});
                }else{
                    res.json({ success: true, blogs: blogs});
                }
            }
        }).sort({ '_id': -1 });
    });

    router.get('/singleBlog/:id', (req, res)=>{
        if(req.params.id){
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if(err){
                    res.json({ success: false, message: err});
                }else{
                    if(!blog){
                        res.json({ success: false, message: "No blog found"});
                    }else{
                        res.json({ success: true, blog});
                    }
                }
            });
        }else{
            res.json({ success: false, message: "No blog found"});
        }
    });


    return router;
}