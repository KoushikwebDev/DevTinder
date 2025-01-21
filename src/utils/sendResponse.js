const sendResponse = async (user, res) => {
    const token = await user.getJwtToken();
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    user.password = undefined;
    res.status(200).cookie("token", token, options).json({
      sucess: true,
      user,
      token,
    });
  };
  
  module.exports = sendResponse;
  