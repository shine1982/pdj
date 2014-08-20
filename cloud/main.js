require('cloud/app.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var resizeImageKey = require('cloud/lib/resize-image-key');

var NORMAL_WIDTH = 612;
var SMALL_WIDTH = 110;

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});
/*
Parse.Cloud.beforeSave("Restaurant", function(req, res) {

    if(req.object.get('name').length===0){
        req.object.set('name',"unnamed");
    }

    Parse.Promise.as().then(function() {

        // Resize to a normal "show" page image size
        return resizeImageKey({
            object: req.object,
            fromKey: "pdjOriginalImage",
            toKey: "pdjNormalImage",
            width: NORMAL_WIDTH
        })
    }).then(function() {
        // Resize to a smaller size for thumbnails
        return resizeImageKey({
            object: req.object,
            fromKey: "pdjOriginalImage",
            toKey: "pdjSmallImage",
            width: SMALL_WIDTH,
            crop: true
        });
    }).then(function(result) {
        res.success();
    }, function(error) {
        res.error(error);
    });

});*/
