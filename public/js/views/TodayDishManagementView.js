var TodayDishManangementView = Parse.View.extend({

    //... is a list tag.
    el:'#restoManagement',

    selectedOriginalPhoto:null,
    croppedResult:null,
    // Cache the template function for a single item.
    template: _.template($('#edit-todaydish-template').html()),

    // The DOM events specific to an item.
    events: {
        'change .recurrenceCombo':'changeRecurrence',
        'change #todayDishImageUploader': 'fileSelected',
        'click #submitTodayDish': 'submitTodayDish',
        'click .defineTodayDishBtn':'clickDefineTodyDishBtn',
        'click .cancelDefineTodayDishBtn': 'cancelDefineTodayDishBtn',
        'click .choseTodayDish':'clickRadioChoseTodayDish',
        'click #okForTodayDish':'okForTodayDish'
    },
    clickDefineTodyDishBtn:function(){
       $(".defineTodayDishBtn").hide();
       $(".cancelDefineTodayDishBtn").show();
       $(".choseTodayDish").show();
    },
    cancelDefineTodayDishBtn:function(){
        $(".defineTodayDishBtn").show();
        $(".cancelDefineTodayDishBtn").hide();
        $(".choseTodayDish").hide();
        $(".choseTodayDish").removeAttr("checked");
    },

    clickRadioChoseTodayDish :function(){
        $('#confirmationChoixPlatdujourModal').modal('show');

    },

    okForTodayDish:function(){
        var todayDishId= $(".choseTodayDish:checked").val();

        var todayDish = app.resto.todayDishList.get(todayDishId);

        todayDish.set("recurrence","jamais");
        todayDish.set("onlydate",moment().toDate());
        todayDish.save().then(function(todayDish){
                _.delay(retrievedPlatdujour,1000);
            });


        $('#confirmationChoixPlatdujourModal').modal('hide');
        this.cancelDefineTodayDishBtn();


    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(id) {
        var that = this;
        that.idResto = id;
        if(id){
            if(app.resto && app.resto.id === id){
                this.initTodayDishes();
                that.render();
            }else{
                var query = new Parse.Query(app.Restaurant);
                query.get(id, {
                    success: function(resto) {
                        app.resto = resto;
                        that.initTodayDishes();
                        that.render();
                    },
                    error: function(object, error) {
                        showMsg(3,"Error pour récuperer le resto avec id "+that.idResto +" ("+error+")");
                    }
                });
            }
        }

    },
    changeRecurrence:function(e){
      if(e.currentTarget.value==="jamais"){
          $("#onlyForDate").show();
      }else{
          $("#onlyForDate").hide();
      }
    },

    initTodayDishes:function(){
        app.resto.todayDishList = new app.TodayDishList();
        app.resto.todayDishList.on('add', this.addOne);

        var queryTodayDishes = new Parse.Query(app.TodayDish);
        queryTodayDishes.equalTo("resto", app.resto);
        queryTodayDishes.find({
            success: function(results){
                app.resto.todayDishList.add(results);
            }
        });


    },
    addOne:function(todayDish){
        var todayDishView = new TodayDishView({model:todayDish});
        $(".todayDishCandidateTable").append(todayDishView.render().el);

    },

    render: function() {

        this.$el.html( this.template());
        retrievedPlatdujour();
        this.init3rdBootstrapComponent();
        return this;
    },


    init3rdBootstrapComponent:function(){
        $('#datepicker').datepicker('setValue', new Date());
        $('input[type=file]').bootstrapFileInput();
    },

    fileSelected : function() {
        var that = this;
        if ($("#todayDishImageUploader")[0].files.length > 0) {

            var file = $("#todayDishImageUploader")[0].files[0];
            $("#uploadDishPhotoSpin").show();
            $("#originalDishImage").html($("#image-panel-template").html());
            // Create an image
            var img = document.createElement("img");
            // Create a file reader
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e)
            {
                img.src = e.target.result;
                var name = "dish.jpg";
                var parseFile = new Parse.File(name, {base64: getResizedImageBase64Data(img)});

                parseFile.save().then(function() {
                    $("#uploadDishPhotoSpin").hide();
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
    submitTodayDish: function(){
        var that = this;
        var dateChosen = $("#datepicker").val();
        if(dateChosen){
            console.log(dateChosen);
           var dateChosenJsDate =  moment(dateChosen, "DD/MM/YYYY", true).toDate();
        }


        var todayDish = new app.TodayDish();
        todayDish.set("name", $("#dishName").val());
        todayDish.set("priceEuro", $("#dishPriceEuro").val());
        todayDish.set("priceCentimes", $("#dishPriceCentimes").val());
        todayDish.set("recurrence", $("#recurrenceTodayDish").val());
        todayDish.set("onlydate", dateChosenJsDate);
        todayDish.set("originalPhoto",this.selectedOriginalPhoto);
        todayDish.set("croppedx",this.croppedResult.x);
        todayDish.set("croppedy",this.croppedResult.y);
        todayDish.set("croppedWidth",this.croppedResult.width);
        todayDish.set("croppedHeight",this.croppedResult.height);
        todayDish.set("resto",app.resto);
        todayDish.save()
            .then(function(todayDish){
                $('#addPlatModal').modal('hide');
                $("#originalDishImage").html("");
                $(".file-input-name").html("");
                app.resto.todayDishList.add(todayDish);
                _.delay(retrievedPlatdujour, 1000);
            }

        )
    }

});

function retrievedPlatdujour(){

    if(app.resto){
        var query = new Parse.Query(app.Restaurant);
        query.get(app.resto.id, {
            success: function(resto) {
                var pdj = resto.get("platdujour");
                if(pdj){
                    pdj.fetch({
                        success: function(pdj) {
                            var imgUrl = pdj.get("normalPhoto").url();
                            var pdjName = pdj.get("name");
                            var prixEuro = pdj.get("priceEuro");
                            var prixCentimes = pdj.get("priceCentimes");
                            var finalPrice = prixEuro+','+prixCentimes+ ' €';
                            var platdujourView = new PlatdujourView({model:{imgUrl:imgUrl,pdjName:pdjName,price:finalPrice}});
                            platdujourView.render();
                        }
                    });
                }
            }
        })
    }
}