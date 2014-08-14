var Uploader = Backbone.View.extend({
  events: {
    "submit": "upload",
    "change input[type=file]": "upload"
  },
  
  initialize: function() {
    var self = this;
    this.fileUploadControl = this.$el.find("input[type=file]")[0];
  },

  showFile: function(e) {
    this.fileUploadControl.click();
    return false;
  },

  upload: function() {
    var self = this;
    
    if (this.fileUploadControl.files.length > 0) {
      this.$(".upload").html("Uploading <img src='/images/spinner.gif' />");
      var file = this.fileUploadControl.files[0];
      var name = "image.jpg";
      var parseFile = new Parse.File(name, file);

      // First, we save the file using the javascript sdk
      parseFile.save().then(function() {
          //console.log(parseFile.url());
        // Then, we post to our custom endpoint which will do the post
        // processing necessary for the image page

        $.post("/i", {
          file: {
            "__type": "File",
            "url": parseFile.url(),
            "name": parseFile.name()
          },
          title: self.$("[name=title]").val()
        }, function(data) {
          window.location.href = "/i/" + data.id;
        });
      },function(err){console.log(err);});
    } else {
      alert("Please select a file");
    }

    return false;
  }
});




$(function() {
  // Make all of special links magically post the form
  // when it has a particular data-action associated
  $("a[data-action='post']").click(function(e) {
    var el = $(e.target);
    el.closest("form").submit();
    return false;
  });
});
