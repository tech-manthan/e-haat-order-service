import { checkSchema } from "express-validator";

export default checkSchema(
  {
    q: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          return value || "";
        },
      },
    },
    currentPage: {
      customSanitizer: {
        options: (value) => {
          const parsedValue = Number(value);
          return Number.isNaN(parsedValue) ? 1 : parsedValue;
        },
      },
    },
    perPage: {
      customSanitizer: {
        options: (value) => {
          const parsedValue = Number(value);
          return Number.isNaN(parsedValue) ? 10 : parsedValue;
        },
      },
    },
    tenantId: {
      optional: true,
      isInt: {
        errorMessage: "tenantId must be an integer",
        bail: true,
      },
      toInt: true,
    },
    isBanned: {
      optional: true,
      customSanitizer: {
        options: (value: unknown) => {
          if (value === undefined || value === null || value === "") {
            return undefined;
          }
          return value === "true" || value === true;
        },
      },
      isBoolean: {
        errorMessage: "isBanned must be a boolean",
      },
    },
  },
  ["query"],
);
