const _ = require('lodash');

const UserModel = require('./user.model');

async function login(req, res, next) {
    try {
        if (req.method !== 'POST' ||
            !req.is('application/x-www-form-urlencoded')) {
            return res.status(400).json({
                message:
                'Method must be POST with application/x-www-form-urlencoded encoding',
            });
        }

        const { email, password } = req.body;

        const user = await UserModel.findByCredential(email.toLowerCase(), password);

        const token = await user.generateToken();

        return res.json({ token, user: _.pick(user, ['email', 'name'])});
    } catch (err) {
        return next(err);
    }
}

async function create(req, res, next) {
    try {
        const { email, password, name } = req.body;
        const lEmail = email.toLowerCase();
 
        const count = await UserModel.count({
            email: lEmail,
        });

        if (count) {
            return res.status(412).json({ message: 'User already exists.' });
        }
        
        const user = await UserModel.create({
            email: lEmail,
            password,
            name,
            created_by: req.user._id,
        });

        return res.json();
    } catch (err) {
        return next(err);
    }
}

async function index(req, res, next) {
    try {
        const users = await UserModel.find()
            .select({ name: 1 });

        return res.json(users);
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    index,
    login,
    create,
};
