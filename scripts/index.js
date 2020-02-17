(function() {
  // Automatically redirect to the HTTPS version of the site.
  if (location.protocol !== "https:") {
    const uri = window.location.href.substring(window.location.protocol.length);
    location.replace("https:" + uri);
  }
})();
