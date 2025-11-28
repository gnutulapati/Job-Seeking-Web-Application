export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
<<<<<<< HEAD
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 5; // Default to 5 days if not set

  const options = {
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // Set maxAge in milliseconds
    httpOnly: true,
=======
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Set httpOnly to true
>>>>>>> c5502a81961d33cccbfc7e23199a06ceb7a69eb3
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
