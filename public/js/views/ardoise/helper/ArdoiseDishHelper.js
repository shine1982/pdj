//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseDishHelper(context){
    this.ctx = context;


    this.newDish=function(label,price,idDishesBloc,callback){
        var self = this;
        this.searchDish(label,
            function(df){
                callback(df);
            },
            function(){
                var ad = new app.ArdoiseDish();
                ad.set("label",label);
                if(price){
                    ad.set("priceEuro",price);
                }
                ad.set("resto",app.resto);
                ad.set("order",app.resto.ardoiseOfDate.dishList.getNextOrder());
                ad.set("idDishesBloc",idDishesBloc);
                ad.save().then(
                    function(ad){
                        callback(ad);
                    }
                )
            }
        );
    };
    this.addNewDish=function(e, idDishesBloc){
        e.preventDefault();
        var label = this.ctx.$(".addDishLabelInput").val();
        var that = this;
        if(label!==''){
            that.newDish(label, '',idDishesBloc,
                function(df){
                    app.resto.ardoiseOfDate.dishList.add(df);
                    that.ctx.$(".addDishLabelInput").val('');
                    that.ctx.$(".addDishPriceInput").val('');
            });
        }else{
            alert("vous devez saisir le nom du plat.");
        }
    };
    this.showAddNewDish=function(e){
        e.preventDefault();
        this.ctx.$(".showAddDish").addClass("editing");
    };
    this.hideAddNewDish=function(e){
        e.preventDefault();
        this.ctx.$("."+this.ctx.model.id+" .showAddDish").removeClass("editing");
    };
    this.searchDish=function(label,success,notsuccess){

        var query =  new Parse.Query(app.ArdoiseDish);
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