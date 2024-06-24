const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User } = require("../../03-mongo/db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Course } = require("../db");

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    User.create({
        username: username,
        password: password
    
    })
    res.json({
       msg:"user created"
    })
    
});

router.post('/signin', (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        username: username,
        password: password
    }).then((user) => {
        if (user) {
            const token = jwt.sign({ username: username
                }, JWT_SECRET, 
                { expiresIn: '1h' });
            res.json({
                token: token
            });
        }
        else {
            res.status(401).json({
                msg: "Invalid credentials"
            });
        }}
    )});
router.get('/courses', async(req, res) => {
    // Implement listing all courses logic'
    const allCourses = await Course.find({});
    res.json({
        courses:allCourses
    })
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    const username = req.username;
    console.log(username)
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    });
    const courses = await Course.find({
        _id:{
            "$in":user.purchasedCourse
        }
    });
    res.json({
        courses:courses
    })
});

module.exports = router