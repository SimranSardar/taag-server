import jwt, { decode } from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.AccessKey;
    const isCustomAuth = token.length < 500; // token > 500 = Google Oauth OR token < 500 = local Auth

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");

      req.userId = decodeData.id;
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
