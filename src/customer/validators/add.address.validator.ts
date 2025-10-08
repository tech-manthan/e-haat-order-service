import { checkSchema } from "express-validator";

export default checkSchema({
  text: {
    exists: {
      errorMessage: "address text is required",
      bail: true,
    },
    isString: {
      errorMessage: "address text must be a string",
      bail: true,
    },
    trim: true,
    notEmpty: {
      errorMessage: "address text cannot be empty",
    },
    isLength: {
      options: { min: 20 },
      errorMessage: "address text must be at least 20 characters",
    },
  },
  isDefault: {
    optional: true,
    isBoolean: {
      errorMessage: "isDefault should be a boolean",
      bail: true,
    },
  },
});
