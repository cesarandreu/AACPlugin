// Import the page-mod API
var pageMod = require("sdk/page-mod");
// Import the self API
var self = require("sdk/self");

  
//Create a page mode, listen to a new page being opened, if it matches the regEx, scripts will be injected onto page.
pageMod.PageMod({
  include: "http://localhost:3000/",
  contentStyleFile: self.data.url("bootstrap.min.css"),
  contentScriptFile: [self.data.url("jquery-1.9.1.js"),
                      self.data.url("bootstrap.min.js"),
                      self.data.url("inject.js")]
});