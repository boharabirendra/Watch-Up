import Joi from "joi";

// Common password validation schema
const passwordSchema = Joi.string()
  .min(8)
  .required()
  .messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "password.uppercase": "Password must have at least one uppercase letter",
    "password.lowercase": "Password must have at least one lowercase letter",
    "password.special": "Password must have at least one special character",
  })
  .custom((value, helpers) => {
    if (!/[A-Z]/.test(value)) {
      return helpers.error("password.uppercase");
    }
    if (!/[a-z]/.test(value)) {
      return helpers.error("password.lowercase");
    }
    if (!/[!@#$%]/.test(value)) {
      return helpers.error("password.special");
    }
    return value;
  });

// Common email validation schema
const emailSchema = Joi.string()
  .email()
  .required()
  .messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid format",
  });

// Register user validation schema
export const registerUserBodySchema = Joi.object({
  email: emailSchema,
  fullName: Joi.string()
    .required()
    .messages({
      "any.required": "Full name is required",
    }),
  password: passwordSchema,
  role: Joi.string().required().messages({
    "any.required": "Role is required",
  })
}).options({
  stripUnknown: true,
});

// Login validation schema
export const loginBodySchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
}).options({
  stripUnknown: true,
});

// Change password validation schema
export const changePasswordBodySchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Old password is required"
  }),
  newPassword: passwordSchema,
}).options({
  stripUnknown: true,
});

// Update user validation schema
export const updateBodySchema = Joi.object({
  fullName: Joi.string()
    .required()
    .messages({
      "any.required": "Full name is required",
    }),
}).options({
  stripUnknown: true,
});


export const getUserQuerySchema = Joi.object({
  q: Joi.string().optional(),
  page: Joi.number().min(1).optional().messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be greater than or equal to 1",
  }).default(1),
  size: Joi.number().min(1).max(10).optional().messages({
    "number.base": "Size must be a number",
    "number.min": "Size must be greater than or equal to 1",
    "number.max": "Size must be less than or equal to 10",
  }).default(12),
}).options({
  stripUnknown: true,
});
