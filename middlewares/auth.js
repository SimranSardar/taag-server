import jwt, { decode } from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.accesskey;
    const isCustomAuth = token.length < 500; // token > 500 = Google Oauth OR token < 500 = local Auth

    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, process.env.AUTH_KEY);

      req.user = decodedData;
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "error",
      message: "Invalid Token",
    });
  }
};

export default auth;
