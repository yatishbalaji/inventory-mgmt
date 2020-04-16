const jwt = require('jsonwebtoken');

const { User } = require('../sqldb');
const { JWT_KEY } = require('../config/environment');

async function authenticate(req, res, next) {
    try {
        const token = (req.header('Authorization') || '')
            .replace('Bearer ', '');

        if (!token) return res.sendStatus(401);

        const data = jwt.verify(token, JWT_KEY);
        
        const user = await User.findOne({ id: data.id });

        if (!user) return res.sendStatus(401);

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(401);
    }
}

module.exports = authenticate;