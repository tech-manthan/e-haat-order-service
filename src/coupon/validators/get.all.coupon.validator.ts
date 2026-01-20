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
        errorMessage: "Tenant ID must be a number",
      },
      toInt: true,
    },

    from: {
      optional: true,

      custom: {
        options: (value, { req }) => {
          const from = value ? new Date(value) : null;
          const to = req.query?.to ? new Date(req.query.to as string) : null;

          // If from exists, to must exist
          if (from && !to) {
            throw new Error("to date is required when from date is provided");
          }

          // If both exist, from <= to
          if (from && to && from > to) {
            throw new Error("from date cannot be after to date");
          }

          return true;
        },
      },
      toDate: true,
    },

    to: {
      optional: true,
      custom: {
        options: (value, { req }) => {
          const to = value ? new Date(value) : null;
          const from = req.query?.from
            ? new Date(req.query.from as string)
            : null;

          // If to exists, from must exist
          if (to && !from) {
            throw new Error("from date is required when to date is provided");
          }

          // from <= to check is already handled in from validator
          return true;
        },
      },
      toDate: true,
    },
  },
  ["query"],
);
