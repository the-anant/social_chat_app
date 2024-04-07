const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtKey = process.env.JWT_KEY;

const fetchUser = async (req, res, next) => {
    let token = await req.header('Authorization');
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        try {
            const user = jwt.verify(token, jwtKey);
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Authorization token is invalid' });
        }
    } else {
        return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }
}

module.exports = fetchUser;
