const NodeCache = require("node-cache"); // Import Node-Cache

const tokenCache = new NodeCache({ stdTTL: 0, checkperiod: 0 }); // Disable TTL and periodic checks

const storeAccessToken = async (token) => {
  console.log("Storing access token:", token); 
  tokenCache.set("accessToken", token); 
  return tokenCache.get("accessToken"); 
};

const retrieveAccessToken = () => {
  return tokenCache.get("accessToken"); // ✅ Correct key usage
};

module.exports = { storeAccessToken, retrieveAccessToken };
