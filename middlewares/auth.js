import jwt, { decode } from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.accesskey;

    let decodedData;
    console.log(token);

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
