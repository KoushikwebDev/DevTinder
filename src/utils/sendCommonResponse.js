const sendCommonResponse = (user, res) => {
  res.status(200).json({
    status : 200,
    sucess: true,
    user,
  });
};

module.exports = sendCommonResponse;
