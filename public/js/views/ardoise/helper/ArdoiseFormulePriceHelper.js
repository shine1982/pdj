//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseFormulePriceHelper(context){
    this.ctx = context;

    this.initFormulePriceListFromZero=function(callback){

        var that = this.ctx;
        var queryArdoiseFormulePrice = new Parse.Query(app.ArdoiseFormulePrice);
        queryArdoiseFormulePrice.ascending("order");
        queryArdoiseFormulePrice.equalTo("resto",app.resto);
        queryArdoiseFormulePrice.limit(3);
        queryArdoiseFormulePrice.find().then(function(list){
            if(list.length === 0){
                var labelArrays = ["plat","entree + plat ou plat + dessert", "entree + plat + dessert"];
                for(var i=0; i<labelArrays.length; i++){
                    that.newFormulePrice(labelArrays[i],'',function(afp){
                        app.resto.ardoiseOfDate.formulePriceList.add(afp);
                    })
                }
            }else{
                app.resto.ardoiseOfDate.formulePriceList.add(list);
            }
            callback();
        })
    };

    this.initFormulePriceListFromRelation=function(){

        var relationFPL = app.resto.ardoiseOfDate.relation("formulePriceList");
        relationFPL.query().ascending("order").find({
            success:function(formulePriceList){
                app.resto.ardoiseOfDate.formulePriceList.add(formulePriceList);
            }
        })
    }
    this.newFormulePrice=function(label,price,callback){
        this.searchFormulePrice(label,
            function(afp){
                callback(afp);
            },
            function(){
                var afp = new app.ArdoiseFormulePrice();
                afp.set("label",label);
                if(price){
                    afp.set("priceEuro",price);
                }
                afp.set("resto",app.resto);
                afp.set("order",app.resto.ardoiseOfDate.formulePriceList.getNextOrder());
                afp.save().then(
                    function(afp){
                        callback(afp);
                    }
                )
            }
        );
    };
    this.addNewFormulePrice=function(e){
        e.preventDefault();
        var label = this.ctx.$(".addFormulePriceLabelInput").val();
        var that = this;
        if(label!==''){
            this.newFormulePrice(label,that.ctx.$(".addFormulePriceEuroInput").val(),function(afp){
                app.resto.ardoiseOfDate.formulePriceList.add(afp);
                that.ctx.$(".addFormulePriceLabelInput").val('');
                that.ctx.$(".addFormulePriceEuroInput").val('');
            });
        }else{
            alert("vous devez au moins saisir le nom de formule!");
        }
    };
    this.showAddNewFormulePrice=function(e){
        e.preventDefault();
        $(".showAddFormulePrice").addClass("editing");
    };
    this.hideAddNewFormulePrice=function(e){
        e.preventDefault();
        $(".showAddFormulePrice").removeClass("editing");
    };
    this.addFormulePrice=function(ardoiseFormulePrice){
        var ardoiseFormulePriceView = new app.ArdoiseFormulePriceView({model:ardoiseFormulePrice});
        $("#zoneFormulePrice .showAddFormulePrice").before(ardoiseFormulePriceView.render().el);
    };
    this.searchFormulePrice=function(label,success,notsuccess){

        var query =  new Parse.Query(app.ArdoiseFormulePrice);
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