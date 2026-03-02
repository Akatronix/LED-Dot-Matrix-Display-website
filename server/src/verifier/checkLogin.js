const z = require("zod");

const loginSchema = z.object({
  email: z.string().email("invalid email"),
  password: z.string(),
});

module.exports = {
  loginSchema,
};
