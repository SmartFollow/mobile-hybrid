function Session(type, accessToken, expireIn, refreshToken) {
    this.tokenType = type;
    this.accessToken = accessToken;
    this.expireIn = expireIn;
    this.refreshToken = refreshToken;
    
    this.getTokenType = function() {
        return (this.tokenType);
    };
    
    this.getAccessToken = function() {
        return (this.accessToken);
    };
    
    this.getExpireIn = function() {
        return (this.expireIn);
    };
    
    this.getRefreshToken = function() {
        return (this.refreshToken);
    };
}