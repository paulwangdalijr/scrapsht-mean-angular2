const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports =
{
    // uri:'mongodb://localhost:27017/mean-angular2',
    uri:'mongodb://root:root@ds123490.mlab.com:23490/mean-angular2',
    secret: crypto,
    db: 'mean-angular2'
}