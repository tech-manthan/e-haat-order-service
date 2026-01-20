import { checkSchema } from "express-validator";

export default checkSchema(
  {
    title: {
      notEmpty: {
        errorMessage: "Title is required",
      },
      isString: {
        errorMessage: "Title must be a string",
      },
      isLength: {
        options: { min: 5 },
        errorMessage: "Title must be at least 5 characters long",
      },
      trim: true,
    },

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

    discount: {
      notEmpty: {
        errorMessage: "Discount is required",
      },
      isNumeric: {
        errorMessage: "Discount must be a number",
      },
      custom: {
        options: (value) => value >= 0,
        errorMessage: "Discount must be positive",
      },
    },

    validity: {
      notEmpty: {
        errorMessage: "Validity is required",
      },
      isISO8601: {
        errorMessage: "Validity must be a valid ISO date (YYYY-MM-DD)",
      },
      toDate: true,
    },

    tenantId: {
      exists: {
        errorMessage: "Tenant ID is required",
        options: { checkFalsy: true },
      },
      isInt: {
        errorMessage: "Tenant ID must be a number",
      },
      toInt: true,
    },
  },
  ["body"],
);
