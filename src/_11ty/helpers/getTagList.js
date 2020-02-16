module.exports = function(collection) {
  let tagSet = new Set();

  collection.getAll().forEach(function(item) {
    if ("tags" in item.data) {
      let tags = item.data.tags;

      tags = tags.filter(function(item) {
        switch (item) {
          // This list should match the `filter` list in tags.njk.
          case "all":
          case "nav":
          case "post":
          case "posts":
            return false;
        }

        return true;
      });

      for (const tag of tags) {
        tagSet.add(tag);
      }
    }
  });

  // Returning an array in addCollection works in Eleventy 0.5.3.
  return [...tagSet];
};
