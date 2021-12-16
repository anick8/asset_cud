let crypto = require('crypto');


exports.hashing = (arg) => {
    data = 'hashxuppu'
    arg.forEach(element => {
        data=data+element.toString()        
    })
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
}


