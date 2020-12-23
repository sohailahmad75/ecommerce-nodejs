exports.createPostValidator = (req,res,next)=>{
    req.check('title', "Title is required").notEmpty();
    req.check('title', "title must be between 2 to 15").isLength({
        min : 2,
        max : 15
    })
    req.check('body', "Body is required").notEmpty();
    req.check('body', "Body must be between 2 to 15").isLength({
        min : 4,
        max : 150 
    })
    const errors = req.validationErrors();

    if (errors){
        const firsterror = errors.map((error)=> error.msg)[0];
        return res.status (400).json({
            error: firsterror,
        })
    }

    next();
}

exports.userSignupValidator = (req, res , next) =>{
    //Name is not null and between 4 to 10 character
    req.check("name", "Name is required").notEmpty();
    req.check("name", "Name must be between 4 to 10 character" ).isLength({
       min : 4,
         max : 10 
     })
    //Email is not null and normalized
    req.check("email" , "Email must be between 3 to 32 character")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min : 4,
        max : 2000
    })
    //Password is not null and must be greater than 6
    req.check("password", "Password is required").notEmpty();
    req.check("password")
    .isLength({min : 6})
    .withMessage("Password must contain atleast 6 character")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    //Check for error
    const errors = req.validationErrors();
    if (errors){
        const firsterror = errors.map((error)=> error.msg)[0];
        return res.status (400).json({
            error: firsterror,
        })
    }
    //proceed to next middleware
    next();
}