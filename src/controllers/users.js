const {Router} = require('express');
const User = require('../models/User');
const router = Router();
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const {jwtAuth} = require('../../utils/auth');
const {JWT_SECRET} = require('../../utils/secrets');




router.get('/login', (req, resp) => {
    resp.send({message: 'Users View'});
});

router.post('/login', [
    check(['username', 'password']).exists()
], async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return resp.status(422).send({errors: errors.array()});
    }
    
    const {username, password} = req.body;
    
    const user = await User.findOne({username});
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            ...user._doc,
            password: undefined
        }, JWT_SECRET);
        return resp.status(200).send({token});
    }
    return resp.status(422).send({'message': 'Username or password is not correct.'});

});

router.post('/sign-up', [
    check(['username', 'password']).exists()
], async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return resp.status(422).send({errors: errors.array()});
    }

    const {username, password, passwordConfirm} = req.body;
    if (password !== passwordConfirm) {
        resp.status(400).send({'message': 'passwords do not match'});
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username: username,
        password: hashedPassword
    });
    try {
        await user.save();
        resp.send({
            ...user._doc,
            password: undefined
        });

    } catch (e) {
        resp.status(400).send(e.message);
    }

});


router.get('/profile', jwtAuth, async (req, resp) => {
    resp.send(req.user);
});
module.exports = router;