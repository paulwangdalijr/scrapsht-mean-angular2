const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        // req.body.email
        // req.body.username
        // req.body.password
        if( !req.body.email && req.body.email === '' ){
            res.json({ success: false, message: 'You must provide an e-email' });
        }else if( !req.body.username && req.body.username === '' ){
            res.json({ success: false, message: 'You must provide an username' });
        }else if( !req.body.password && req.body.password === '' ){
            res.json({ success: false, message: 'You must provide an password' });
        }else{
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            });
            user.save((err) => {
                if(err){
                    if(err.code === 11000){
                        res.json({ success: false, message: 'username or email already exists' });
                    }else if(err.errors.email){                        
                        res.json({ success: false, message: err.errors.email.message });
                    }else if(err.errors.username){                        
                        res.json({ success: false, message: err.errors.username.message });    
                    }else if(err.errors.password){                        
                        res.json({ success: false, message: err.errors.password.message });    
                    }else{
                        res.json({ success: false, message: 'unable to create user' });
                    }
                }else{
                    res.json({ success:true, message:'Account created!'});
                }
            });            
        }

    });

    router.get('/checkEmail/:email', (req,res) => {
        if(!req.params.email){
            res.json({success: false, message: 'Email not provided!'});
        }else{
            User.findOne({ email: req.params.email }, (err, user) => {
                if(err){
                    res.json({success: false, message: err});
                }else{
                    if(user){
                        res.json({success: false, message: 'Email is already taken!'});
                    }else{
                        res.json({success: true, message: 'Email is available!'});
                    }
                    
                }
            });
        }
    });

    router.get('/checkUsername/:username', (req,res) => {
        if(!req.params.username){
            res.json({success: false, message: 'username not provided!'});
        }else{
            User.findOne({ username: req.params.username }, (err, user) => {
                if(err){
                    res.json({success: false, message: err});
                }else{
                    if(user){
                        res.json({success: false, message: 'Username is already taken!'});
                    }else{
                        res.json({success: true, message: 'Username is available!'});
                    }
                    
                }
            });
        }
    });

    router.post('/login', (req,res) => {
        if(!req.body.username){
            res.json({success: false, message: 'Username not provided!'});
        }else if(!req.body.password){
            res.json({success: false, message: 'Password not provided!'});
        }else{
            User.findOne({
                username: req.body.username.toLowerCase()
            }, (err, user) => {
                if(err || !user){
                    res.json({success: false, message: 'Username and password not found!'});
                }else{
                    const flag = user.comparePassword(req.body.password);
                    if(flag){
                        const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h'});
                        res.json({success: true, message: 'Login successful', token: token, user: {username: user.username} });
                    }else{
                        res.json({success: false, message: 'Username and password not found!'});
                    }
                }
            });
        }
    });

    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if(!token){
            res.json({success: false, message: 'No token provided!'});
        }else{
            jwt.verify(token, config.secret, (err, decoded) => {
                if(err){
                    res.json({success: false, message: 'Token invalid! ' + err});
                }else{
                    req.decoded = decoded;
                    // next();
                    User.findOne({ _id: decoded.userId }, (err, user) => {                        
                        if(err){
                            res.json({success: false, message: 'Token invalid!'});
                        }else{
                            if(user){
                                req.username = user.username;

                                next();                                
                            }else{
                                res.json({success: false, message: 'Token invalid!'});
                            }                            
                        }
                    });
                    
                }
            });
        }
    });

    router.get('/profile', (req, res) => {
        const user = User.findOne({ _id: req.decoded.userId}).select('username email').exec((err, user) => {
            if(err || !user){
                res.json({success: false, message: err});
            }else{
                res.json({ success: true, user });
            }
        })
    });

    return router;
}