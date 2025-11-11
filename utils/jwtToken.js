export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  
  // ✅ Three separate tokens for three roles
  let cookieName;
  if (user.role === 'Admin') {
    cookieName = 'adminToken';
  } else if (user.role === 'Doctor') {
    cookieName = 'doctorToken';  // ✅ Doctor ka alag token
  } else {
    cookieName = 'patientToken';
  }

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};