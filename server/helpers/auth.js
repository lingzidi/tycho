export default function(req, res, next) {
  if(req.user) {
    next();
  } else {
    res.json(403, {msg: 'unauthorized'});
  }
}