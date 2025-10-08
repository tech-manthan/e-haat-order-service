import { checkSchema } from "express-validator";

export default checkSchema(
  {
    tenantId: {
      isInt: {
        errorMessage: "tenantId must be an integer",
        bail: true,
      },
      toInt: true,
      customSanitizer: {
        options: (value: unknown) => String(value) || "",
      },
    },
  },
  ["body"],
);
