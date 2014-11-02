//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseDishesBlocHelper(context){
    this.ctx = context;

    this.initDishesBlocListFromZero=function(callback){

        var queryArdoiseDishesBloc = new Parse.Query(app.ArdoiseDishesBloc);
        queryArdoiseDishesBloc.ascending("order");
        queryArdoiseDishesBloc.equalTo("resto",app.resto);
        queryArdoiseDishesBloc.limit(3);
        queryArdoiseDishesBloc.find().then(function(list){
            if(list.length === 0){
                var labelArrays = ["Entrées","Plats", "Desserts"];
                Parse.Promise.as().then(function() {

                    var promises = [];
                    var order=1;
                    _.each(labelArrays, function(label) {
                        var db = new app.ArdoiseDishesBloc();
                        db.set("label",label);
                        db.set("resto",app.resto);
                        db.set("order",order);
                        order++;
                        app.resto.ardoiseOfDate.dishesBlocList.add(db);
                        promises.push(db.save());
                    });
                    return Parse.Promise.when(promises);

                }).then(function() {
                    callback();
                });
            }else{
                app.resto.ardoiseOfDate.dishesBlocList.add(list);
                callback();
            }

        })
    };
    this.newDishesBloc=function(label,price,order,callback){
        this.searchDishesBloc(label,
            function(df){
                callback(df);
            },
            function(){
                var df = new app.ArdoiseDishesBloc();
                df.set("label",label);
                if(price){
                    df.set("priceEuro",price);
                }
                df.set("resto",app.resto);
                df.set("order",order);
                df.save().then(
                    function(df){
                        callback(df);
                    }
                )
            }
        );
    };
    this.addNewDishesBloc=function(e){
        e.preventDefault();
        var label = this.ctx.$(".addDishesBlocLabelInput").val();
        var that = this;
        if(label!==''){
            that.newDishesBloc(label,that.ctx.$(".addDishesBlocPriceEuroInput").val(),app.resto.ardoiseOfDate.dishesBlocList.getNextOrder(),function(df){
                app.resto.ardoiseOfDate.dishesBlocList.add(df);
                that.ctx.$(".addDishesBlocLabelInput").val('');
                that.ctx.$(".addDishesBlocPriceEuroInput").val('');
            });
        }else{
            alert("vous devez saisir le nom du bloc!");
        }
    };
    this.showAddNewDishesBloc=function(e){
        e.preventDefault();
        this.ctx.$(".showAddDishesBloc").addClass("editing");
    };
    this.hideAddNewDishesBloc=function(e){
        e.preventDefault();
        this.ctx.$(".showAddDishesBloc").removeClass("editing");
    };
    this.addDishesBloc=function(ardoiseDishesBloc){
        var ardoiseDishesBlocView = new app.ArdoiseDishesBlocView({model:ardoiseDishesBloc});
        $("#zoneDishesBlocs .showAddDishesBlocBtn").before(ardoiseDishesBlocView.render().el);
    };
    this.searchDishesBloc=function(label,success,notsuccess){

        var query =  new Parse.Query(app.ArdoiseDishesBloc);
        query.equalTo("resto", app.resto);
        query.equalTo("label",label);
        query.find().then(function(results){
            if(results.length>0){
                success(results[0]);
            }else{
                notsuccess();
            }
        })
    };
}