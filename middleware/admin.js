const jwt=require('jsonwebtoken')

module.exports=function (req, res, next) {
  console.log('Admin : '+JSON.stringify(req.user))
  if (!req.user.isAdmin)
    return res.status(403).send({ error: "Access denied. Only admin has access to this task" });

next();
}

