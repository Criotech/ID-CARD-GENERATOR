
exports.signup = function(req, res, next) {
  let success = req.flash('success')
  res.render('signup', {success});
}