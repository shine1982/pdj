var PhotosView = Parse.View.extend({

    //... is a list tag.
    el:'#restoManagement',

    currentPhotoType:0,
    selectedOriginalPhoto:null,
    croppedResult:null,

    // Cache the template function for a single item.
    template: _.template($('#photos-template').html()),

    events: {
        'click .addPhoto': 'setPhotoType',
        'change #imageUploader': 'fileSelected',
        'click #submitCroppedPhoto': 'submitCroppedPhoto'
    },
    initialize: function(id) {
        var that = this;
        that.idResto = id;

        if(id){
            if(app.resto && app.resto.id === id){
                this.initPhotos();
            }else{
                var query = new Parse.Query(app.Restaurant);
                query.get(id, {
                    success: function(resto) {
                        app.resto = resto;
                        that.initPhotos();
                    },
                    error: function(object, error) {
                        showMsg(3,"Error pour récuperer le resto avec id "+that.idResto +" ("+error+")");
                    }
                });
            }
        }



    },
    initPhotos:function(){
        app.resto.photos = new app.Photos();
        app.resto.photos.on('add', this.addOne);

        var queryPhotos = new Parse.Query(app.Photo);
        queryPhotos.equalTo("resto", app.resto);
        queryPhotos.find({
            success: function(results){
                app.resto.photos.add(results);
            }
        });
    },
    addOne:function(photo){

        var photoView = new PhotoView({model:photo})
        var idSelector = "#dishPhotosContainer";
        if(photo.get("category")==app.constants.PHOTO_CATEGORY.restaurant){
            idSelector = "#restoPhotosContainer";
        }
        $(idSelector).append(photoView.render().el);
    },
    setPhotoType:function(e){
      if(e.currentTarget.id==="addDishPhoto"){
          this.currentPhotoType = app.constants.PHOTO_CATEGORY.dish;
      }else if(e.currentTarget.id==="addRestoPhoto"){
          this.currentPhotoType = app.constants.PHOTO_CATEGORY.restaurant;
      }
    },

    fileSelected : function() {
        var that = this;


        if ($("#imageUploader")[0].files.length > 0) {

            var file = $("#imageUploader")[0].files[0];
            $("#uploadImageSpin").show();
            $("#originalImage").html($("#image-panel-template").html());
            // Create an image
            var img = document.createElement("img");
            // Create a file reader
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e)
            {
                img.src = e.target.result;

                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 1024;
                var MAX_HEIGHT = 768;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                var dataurl = canvas.toDataURL("image/jpeg");

                var name = "image.jpg";
                var parseFile = new Parse.File(name, {base64: dataurl.substring(23)});


                parseFile.save().then(function() {
                    $("#uploadImageSpin").hide();
                    that.selectedOriginalPhoto=parseFile;
                    $("#imageContainer").attr("src",parseFile.url());
                    $(".cropper").cropper({
                        aspectRatio: 1.333,
                        done: function(data) {
                            that.croppedResult = data;
                        }
                    });
                });

            }
            reader.readAsDataURL(file);
        } else {
            alert("Please select a file");
        }
    },
    submitCroppedPhoto: function(){

        var photo = new app.Photo();
        photo.set("originalPhoto",this.selectedOriginalPhoto);
        photo.set("croppedx",this.croppedResult.x);
        photo.set("croppedy",this.croppedResult.y);
        photo.set("croppedWidth",this.croppedResult.width);
        photo.set("croppedHeight",this.croppedResult.height);
        photo.set("resto",app.resto);
        photo.set("category",this.currentPhotoType);
        photo.set("order", app.resto.photos.nextOrder(this.currentPhotoType));
        photo.save()
            .then(function(photo){
                $('#normalImageModel').modal('hide');
                $("#originalImage").html("");
                $(".file-input-name").html("");
                app.resto.photos.add(photo);
            }

        )
    },

    render: function() {
        this.$el.html( this.template());
        return this;
    }
});