//test keys
//change these with your app keys
var appId = "09qsWVn2x6ItvvCuxaDIOmGDoc7aPbAVGLAPOCbZ";
var javaScriptKey = "5UY4Kz0No8G0IP7vke7f6auJKZVESqAJCd7TmNob";
var masterKey = "tTlDbssacHkpRnEhLD4hDOJ64Q6IZ8N1eytfCrZB";

//local module
global.Parse = require("./../parse-cloud-debugger").Parse;

//npm module
//global.Parse = require("parse-cloud-debugger").Parse;

//init parse modules
Parse.initialize(appId, javaScriptKey, masterKey);

//run cloud code
require('./cloud/main.js');