export const membershipSchema = {
  validate(data) {
    if (!data.name || typeof data.price === "undefined") return { error: { message: "name and price required" } };
    return { error: null };
  },
};
