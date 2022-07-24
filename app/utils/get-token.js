function getToken(request) {
  let token = 
    request.headers.authorization
    ? request.headers.authorization.replace('Bearer ', '')
    : null;
  return token && token.length ? token : null;
}

module.exports = getToken;