export default function validate(schema) {
  return (req, res, next) => {
    try {
      const data = { ...req.body, ...req.params, ...req.query };
      const result = schema.validate ? schema.validate(data) : { error: null };
      if (result.error) return res.status(400).json({ success: false, message: result.error.message });
      next();
    } catch (err) {
      next(err);
    }
  };
}
