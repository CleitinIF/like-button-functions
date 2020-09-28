module.exports = function getId(urlPath) {
  return Number(urlPath.match(/([^\/]*)\/*$/)[0]);
};
