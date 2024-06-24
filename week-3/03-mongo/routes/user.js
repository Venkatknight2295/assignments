const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { Course,User } = require("../db");


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
        msg: "User Created"
    })
});

router.delete('/userdelete', async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
   await User.deleteOne({
        username: username,
        password: password
    });
    res.json({
        msg:"User Deleted"
    })
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const allCourses = await Course.find({});
    res.json({
        courses:allCourses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.headers.username;
    try {
        const result = await User.updateOne({
            username: username
        }, {
            "$push": {
                purchasedCourse: courseId
            }
        });

        if (result.nModified === 0) {
            return res.status(404).json({ msg: "User not found or course already purchased" });
        }

        res.json({ msg: "Course Purchased" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

router.delete('/courses/delete/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.headers.username;
    try {
        await User.updateOne({
            username: username
        }, {
            "$pull": {
                purchasedCourse: courseId
            }
        });
        res.json({
            msg: "Course Deleted"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Wrong Course please check" });
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
   const user = await User.findOne({
        username: req.headers.username
    });
    console.log(user.purchased);
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