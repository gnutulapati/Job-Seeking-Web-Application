export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 5; // Default to 5 days if not set

  const options = {
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // Set maxAge in milliseconds
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
