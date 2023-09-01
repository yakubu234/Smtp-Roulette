import { check, body, validationResult } from 'express-validator';

export default [
    check("recepient_email")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("recepient email  must have more than 3 characters"),
    check("recepient_name")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Recepient name  must have more than 1 characters"),
    check("email_body_data")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 3 })
        .withMessage("first name must have more than 3 characters"),
    check("email_message")
        .if(body('email_body_data').isEmpty())
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Email message  must have more than 3 characters"),
    check("email_type")
        .exists().isIn(['api', 'smtp'])
        .escape()
        .withMessage('email_type only accept values like "api", "smtp"'),
    check("email_view")
        .if(body('email_body_data').exists())
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("email view is required if email body data is present"),
    check("email_subject")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Email Subject  must have more than 3 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({
                status: "error",
                message: errors.array(),
                data: null
            });
        next();
    },
];
