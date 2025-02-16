const config = require("../config");

const sendResponse = async (user, res) => {
    const token = await user.getJwtToken();
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true, // cookie will not be accessible from javascript
      sameSite: "strict", // Prevent CSRF(Cross-Site Request Forgery)
      secure: config.NODE_ENV === "production", // HTTPS-only in production
    };
    user.password = undefined;
    res.status(200).cookie("token", token, options).json({
      status : 200,
      sucess: true,
      user,
      token,
    });
  };
  
  module.exports = sendResponse;
  