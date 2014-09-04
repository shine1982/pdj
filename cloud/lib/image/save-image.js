
var cropImage = require("cloud/lib/image/crop-image");
var scaleAndSaveImage = require("cloud/lib/image/scale-and-save-image");

module.exports = function(req,res) {

    //c'est pour avoir une ratio 4:3
    var normalImageWidth=540;
    var thumbnailImageWidth=180;
    //these five fields will be deleted later when everything goes right.
    var originalPhoto = req.object.get("originalPhoto");
    var croppedx = req.object.get("croppedx");
    var croppedy = req.object.get("croppedy");
    var croppedWidth = req.object.get("croppedWidth");
    var croppedHeight = req.object.get("croppedHeight");

    if(originalPhoto){
        var normalRatio = 1; //on ne scope pas
        if (croppedWidth > normalImageWidth) {
            normalRatio = normalImageWidth / croppedWidth;
        }
        var thumbnailRatio = 0.333;
        if (croppedWidth < normalImageWidth) {
            thumbnailRatio = thumbnailImageWidth / croppedWidth;
        }
        var miniThumbnailRatio = 0.25;

        cropImage(originalPhoto.url(),croppedx,croppedy,croppedWidth,croppedHeight)
            .then(function(image) {
                if (normalRatio<1) {
                    return image.scale({
                        ratio: normalRatio
                    });
                } else {
                    return Parse.Promise.as(image);
                }
            }).then(function(image) {

                return image.setFormat("JPEG");// Make sure it's a JPEG to save disk space and bandwidth.
            })
            .then(function(image) {
                // Get the image data in a Buffer.
                return image.data();
            }).then(function(buffer) {

                // Save the image into a new file.
                var base64 = buffer.toString("base64");
                var cropped = new Parse.File("normalPhoto.jpg", { base64: base64 });
                return cropped.save();
            }).then(function(cropped) {
                // Attach the image file to the original object.
                req.object.set("normalPhoto", cropped);
                return scaleAndSaveImage(cropped, thumbnailRatio, "thumbnailPhoto.jpg");

            }).then(function(thumbnailed) {
                req.object.set("thumbnailPhoto", thumbnailed);
                return scaleAndSaveImage(thumbnailed, miniThumbnailRatio, "miniThumbnailPhoto.jpg");

            }).then(
            function(miniThumbnailed) {
                req.object.set("miniThumbnailPhoto", miniThumbnailed);

                req.object.unset("originalPhoto");
                req.object.unset("croppedx");
                req.object.unset("croppedy");
                req.object.unset("croppedWidth");
                req.object.unset("croppedHeight");
                res.success();
            }, function(error) {
                res.error(error);
            })
    }else{
        res.success();
    }
}
