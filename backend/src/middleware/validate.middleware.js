export const requireBody = fields => (req, res, next) => {
  for (const f of fields) {
    if (req.body[f] === undefined) {
      return res.status(400).json({ message: `Missing field: ${f}` });
    }
  }
  next();
};
