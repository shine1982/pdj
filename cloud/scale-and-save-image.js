var Image = require("parse-image");

module.exports = function(imageTraited,scaleRatio,name) {

    return Parse.Cloud.httpRequest({
        url: imageTraited.url()
    }).then(
        function(response){
        var image = new Image();
        return image.setData(response.buffer);
    }).then(
        function(image){
        return image.scale({
        ratio: scaleRatio
    });
    }).then(function(imageScaled){
        return imageScaled.data();

    }).then(function(buffer){

        var base64 = buffer.toString("base64");
        var imageResult = new Parse.File(name, { base64: base64 });
        return imageResult.save();
    });
}
