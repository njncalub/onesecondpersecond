module.exports = function(jsonString) {
  const array = JSON.parse(jsonString);
  return array.join(", ");
};