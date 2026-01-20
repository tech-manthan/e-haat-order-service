import { checkSchema } from "express-validator";

export default checkSchema(
  {
    title: {
      optional: true,
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
      optional: true,

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
      optional: true,

      isNumeric: {
        errorMessage: "Discount must be a number",
      },
      custom: {
        options: (value) => value >= 0,
        errorMessage: "Discount must be positive",
      },
    },

    validity: {
      optional: true,

      isISO8601: {
        errorMessage: "Validity must be a valid ISO date (YYYY-MM-DD)",
      },
      toDate: true,
    },

    tenantId: {
      optional: true,

      isInt: {
        errorMessage: "Tenant ID must be a number",
      },
      toInt: true,
    },
  },
  ["body"],
);
