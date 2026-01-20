import { checkSchema } from "express-validator";

export default checkSchema({
  code: {
    notEmpty: {
      errorMessage: "Code is required",
    },
    isString: {
      errorMessage: "Code must be a string",
    },
    matches: {
      options: [/^[A-Z0-9\-_]+$/],
      errorMessage:
        "Code must contain only uppercase letters, numbers, and allowed symbols (-, _)",
    },
    trim: true,
  },
});
