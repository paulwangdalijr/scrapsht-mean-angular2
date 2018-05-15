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
                        // res.json({ success: true, blog});

                        User.findOne({ _id: req.decoded.userId }, (err, user) => {                        
                            if(err || !user){
                                res.json({ success: false, message: "User not authorized to update the blog."});
                            }else{                 
                                if(user.username !== blog.createdBy){
                                    res.json({ success: false, message: "User not authorized to update the blog."});                                    
                                }else{         
                                    res.json({ success: true, blog});
                                }
                            }
                        });

                    }
                }
            });
        }else{
            res.json({ success: false, message: "No blog found"});
        }
    });

    router.put('/updateBlog', (req, res)=>{
        if(!req.body._id){
            res.json({success: false, message: 'ID is required.'});
        }else if(!req.body.title){
            res.json({success: false, message: 'Title is required.'});
        }else if(!req.body.body){
            res.json({success: false, message: 'Body is required.'});       
        // }else if(!req.body.createdBy){
        //     res.json({success: false, message: 'CreatedBy is required.'});            
        }else{

            Blog.findOne({ _id: req.body._id}, (err,blog)=>{
                if(err){
                    res.json({success: false, message: 'ID is invalid.'});
                }else if(!blog){
                    res.json({success: false, message: 'Blog not found.'});
                }else{                    
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {                        
                        if(err || !user){
                            res.json({ success: false, message: "User not authorized to update the blog."});
                        }else{                 
                            if(user.username !== blog.createdBy){
                                res.json({ success: false, message: "User not authorized to update the blog."});
                            }else{      
                                blog.title = req.body.title;
                                blog.body = req.body.body;
                                blog.save((err)=>{
                                    if(err){
                                        res.json({success:false, message:err})  
                                    }else{
                                        res.json({success:true, message:"Blog updated!"})
                                    }
                                });
                            }
                        }
                    });
                }
            });            
        }
    });

    router.delete('/deleteBlog/:id', (req, res)=>{
        if(req.params.id){
            Blog.findOne({ _id: req.params.id}, (err,blog)=>{
                if(err){
                    res.json({success: false, message: 'ID is invalid.'});
                }else if(!blog){
                    res.json({success: false, message: 'Blog not found.'});
                }else{                    
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {                        
                        if(err || !user){
                            res.json({ success: false, message: "User not authorized to delete the blog."});
                        }else{                 
                            if(user.username !== blog.createdBy){
                                res.json({ success: false, message: "User not authorized to delete the blog."});
                            }else{      
                                blog.remove((err)=>{
                                    if(err){
                                        res.json({success:false, message:err})  
                                    }else{
                                        res.json({success:true, message:"Blog deleted!"})
                                    }
                                });
                            }
                        }
                    });
                }
            });            
        }else{
            res.json({success: false, message: 'ID is blank.'});
        }
    });

    router.put('/postComment', (req, res)=>{
        if(!req.body._id){
            res.json({success: false, message: 'ID is required.'});
        }else if(!req.body.comment){
            res.json({success: false, message: 'Comment is required.'});        
        // }else if(!req.body.createdBy){
        //     res.json({success: false, message: 'CreatedBy is required.'});            
        }else{

            Blog.findOne({ _id: req.body._id}, (err,blog)=>{
                if(err){
                    res.json({success: false, message: 'ID is invalid.'});
                }else if(!blog){
                    res.json({success: false, message: 'Blog not found.'});
                }else{                    
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {                        
                        if(err || !user){
                            res.json({ success: false, message: "Invalid user."});
                        }else{                                                 
                            let comment = {
                                comment: req.body.comment,
                                commentBy: user.username                            
                            }
                            blog.comments.push(comment);
                            blog.save((err)=>{
                                if(err){
                                    res.json({success:false, message:err})  
                                }else{
                                    res.json({success:true, message:"Blog updated!"})
                                }
                            });
                        }
                    });
                }
            });            
        }
    });

    router.put('/likeDislike', (req, res)=>{
        if(!req.body._id){
            res.json({success: false, message: 'ID is required.'});
        // }else if(!req.body.action){
        //     res.json({success: false, message: 'No action'});    
            
        // }else if(!req.body.createdBy){
        //     res.json({success: false, message: 'CreatedBy is required.'});            
        }else{

            Blog.findOne({ _id: req.body._id}, (err,blog)=>{
                if(err){
                    res.json({success: false, message: 'ID is invalid.'});
                }else if(!blog){
                    res.json({success: false, message: 'Blog not found.'});
                }else{                    
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {                        
                        if(err || !user){
                            res.json({ success: false, message: "Invalid user."});
                        }else{                                                 
                            if(req.body.action === 0){ //like
                                if(blog.likedBy.includes(user.username)){    
                                    res.json({ success: false, message: "User already liked this blog."});      
                                    return;                          
                                }else if(blog.dislikedBy.includes(user.username)){
                                    blog.dislikes--;
                                    const index = blog.dislikedBy.indexOf(user.username);
                                    blog.dislikedBy.splice(index, 1);
                                }else{ 
                                }
                                blog.likes++;
                                blog.likedBy.push(user.username);    
                            }else if(req.body.action === 1){ //dislike
                                if(blog.likedBy.includes(user.username)){   
                                    blog.likes--;
                                    const index = blog.likedBy.indexOf(user.username);
                                    blog.likedBy.splice(index, 1);      
                                }else if(blog.dislikedBy.includes(user.username)){
                                    res.json({ success: false, message: "User already disliked this blog."});  
                                    return;                      
                                }else{
                                }
                                blog.dislikes++;
                                blog.dislikedBy.push(user.username);    
                            }
                            blog.save((err)=>{
                                if(err){
                                    res.json({success:false, message:err})  
                                }else{
                                    res.json({success:true, message:"Blog updated!"})
                                }
                            });
                        }
                    });
                }
            });            
        }
    });


    return router;
}