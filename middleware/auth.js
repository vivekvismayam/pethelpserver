const jwt=require('jsonwebtoken')


module.exports=function (req, res, next) {

    //const token = req.header("x-auth-token");
    const token=req.cookies['x-auth-token']
    console.log();    
  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided" });
    try{
        const decoded=jwt.verify(token,process.env.JWTPrivateKey);
        req.user=decoded;
        next();

    }catch(e){
     res.status(400).send({ error: "Access denied. Invalid token " });
    }
}


