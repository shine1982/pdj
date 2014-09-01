var Image = require("parse-image");

module.exports = function(originalPhotoUrl, croppedx,croppedy, croppedWidth, croppedHeight) {

    return Parse.Cloud.httpRequest({
        url: originalPhotoUrl

    }).then(function(response) {
        var image = new Image();
        return image.setData(response.buffer);
    }).then(function(image) {
        return image.crop({
            left: croppedx,
            top: croppedy,
            width: croppedWidth,
            height: croppedHeight
        });
    });
}
