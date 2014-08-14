var Image = require("parse-image");

/*
  Resizes an image from one Parse Object key containing
  a Parse File to a file object at a new key with a target width.
  If the image is smaller than the target width, then it is simply
  copied unaltered.
 
  object: Parse Object
  fromKey: Key containing the source Parse File
  toKey: Key to contain the target Parse File
  width: Target width
  crop: Center crop the square
*/
module.exports = function(options) {
  var format, originalHeight, originalWidth;

  // First get the image data
  return Parse.Cloud.httpRequest({
    url: options.object.get(options.fromKey).url()
  }).then(function(response) {
    var image = new Image();
    return image.setData(response.buffer);
  }).then(function(image) {
    // set some metadata that will be on the object
    format = image.format();
    originalHeight = image.height();
    originalWidth = image.width();
    
    if (image.width() <= options.width) {
      // No need to resize
      return new Parse.Promise.as(image);
    } else {
      var newWidth = options.width;
      var newHeight = options.width * image.height() / image.width();

      // If we're cropping to a square, then we need to adjust height and
      // width so that the greater length of the two fits the square
      if (options.crop && (newWidth > newHeight)) {
        var newHeight = options.width;
        var newWidth = newHeight * image.width() / image.height();
      }
      
      // resize down to normal width size
      return image.scale({
        width: newWidth,
        height: newHeight
      });
    }
  }).then(function(image) {
    if (options.crop) {
      var left = 0;
      var top = 0;

      // Center crop
      if (image.width() > image.height()) {
        var left = (image.width() - image.height()) / 2;
      } else {
        var top = (image.height() - image.width()) / 2;
      }
      
      return image.crop({
        left: left,
        top: top,
        width: options.width,
        height: options.width
      });
    } else {
      return Parse.Promise.as(image);
    }
  }).then(function(image) {
    // Get the image data in a Buffer.
    return image.data();
  }).then(function(buffer) {
    // Save the image into a new file.
    var base64 = buffer.toString("base64");
    var scaled = new Parse.File("image." + format, { base64: base64 });
    return scaled.save();
  }).then(function(image) {
    // Set metadata on the image object
    options.object.set(options.toKey, image);
    options.object.set("format", format);
    options.object.set("width", originalWidth);
    options.object.set("height", originalHeight);
  });
};
