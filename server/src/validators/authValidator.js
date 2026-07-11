export const registerSchema = {
  validate(data) {
    if (!data.email || !data.password) return { error: { message: "Email and password are required" } };
    return { error: null };
  },
};

export const loginSchema = {
  validate(data) {
    if (!data.email || !data.password) return { error: { message: "Email and password are required" } };
    return { error: null };
  },
};
