exports.userSignUpValidator = (req, res  , next) => {
    req.check('name', 'Name is Not Empty').notEmpty();
    req.check('email','Email must contain 4-32 character')
    .isLength({
        min : 3,
        max:32
    })
    .matches(/.+\@.+\..+/)
    .withMessage("Email Must Contain @");
    req.check('password','password must contain min 6 character')
    .isLength({
        min:6
    })
    .matches(/\d/)
    .withMessage("Password must contain Number");

    const errors  = req.validationErrors();
    if (errors){
         const firstError = errors.map(error =>error.msg)[0]
         return res.status(400).json({error : firstError})
     }
    next();
};