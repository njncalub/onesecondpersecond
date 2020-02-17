(function() {
  if (location.protocol !== "https:") {
    const uri = "https:" + window.location.href.substring(window.location.protocol.length);
    location.replace(uri);
  }
})();
