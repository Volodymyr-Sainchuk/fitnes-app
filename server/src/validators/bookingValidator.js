export const createBookingSchema = {
  validate(data) {
    if (!data.classId) return { error: { message: "classId is required" } };
    return { error: null };
  },
};
