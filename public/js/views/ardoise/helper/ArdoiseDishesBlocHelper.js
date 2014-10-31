//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseDishesBlocHelper(context){
    this.ctx = context;

    this.initDishesBlocListFromZero=function(callback){

        var that = this.ctx;
        var queryArdoiseDishesBloc = new Parse.Query(app.ArdoiseDishesBloc);
        queryArdoiseDishesBloc.ascending("order");
        queryArdoiseDishesBloc.equalTo("resto",app.resto);
        queryArdoiseDishesBloc.limit(3);
        queryArdoiseDishesBloc.find().then(function(list){
            if(list.length === 0){
                var labelArrays = ["Entrées","Plats", "Desserts"];
                for(var i=0; i<labelArrays.length; i++){
                    that.newDishesBloc(labelArrays[i],'',function(df){
                        app.resto.ardoiseOfDate.dishesBlocList.add(df);
                    })
                }
            }else{
                app.resto.ardoiseOfDate.dishesBlocList.add(list);
            }
            callback();
        })
    };

    this.initDishesBlocListFromRelation=function(){

        var relationDF = app.resto.ardoiseOfDate.relation("dishesBlocList");
        relationDF.query().ascending("order").find({
            success:function(dishesBlocList){
                app.resto.ardoiseOfDate.dishesBlocList.add(dishesBlocList);
            }
        })
    }
    this.newDishesBloc=function(label,price,callback){
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
                df.set("order",app.resto.ardoiseOfDate.dishesBlocList.getNextOrder());
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
            that.newDishesBloc(label,that.ctx.$(".addDishesBlocPriceEuroInput").val(),function(df){
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
        $(".showAddDishesBloc").addClass("editing");
    };
    this.hideAddNewDishesBloc=function(e){
        e.preventDefault();
        $(".showAddDishesBloc").removeClass("editing");
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