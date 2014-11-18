//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseFormulePriceHelper(context){
    this.ctx = context;

    this.initFormulePriceListFromZero=function(callback){

        var queryArdoiseFormulePrice = new Parse.Query(app.ArdoiseFormulePrice);
        queryArdoiseFormulePrice.ascending("order");
        queryArdoiseFormulePrice.equalTo("resto",app.resto);
        queryArdoiseFormulePrice.limit(3);
        queryArdoiseFormulePrice.find().then(function(list){
            if(list.length === 0){
                var labelArrays = ["plat","entree + plat ou plat + dessert", "entree + plat + dessert"];

                Parse.Promise.as().then(function() {
                    var promises = [];
                    var order=1;
                    _.each(labelArrays, function(label) {
                        var afp = new app.ArdoiseFormulePrice();
                        afp.set("label",label);
                        afp.set("resto",app.resto);
                        afp.set("order",order);
                        order++;
                        app.resto.ardoiseOfDate.formulePriceList.add(afp);
                        promises.push(afp.save());
                    });
                    return Parse.Promise.when(promises);

                }).then(function() {
                  callback();
                });
            }else{
                app.resto.ardoiseOfDate.formulePriceList.add(list);
                callback();
            }

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

    this.addNewFormulePrice=function(e){
        e.preventDefault();
        var label = this.ctx.$(".addFormulePriceLabelInput").val();
        var price = this.ctx.$(".addFormulePriceEuroInput").val();
        var that = this;
        if(label!==''){
           app.parseRelationHelper.addToList(
               app.resto.ardoiseOfDate,
               app.constants.RELATION_FORMULE_PRICE_LIST,
               label,
               price,
               app.ArdoiseFormulePrice,
               app.resto.ardoiseOfDate.formulePriceList,
               function(item){
                   that.ctx.$(".addFormulePriceLabelInput").val('');
                   that.ctx.$(".addFormulePriceEuroInput").val('');
               },
               function(errNo){
                   if(errNo ===1){
                       alert("'"+label+"' déjà dans la liste!");
                   }
               }
           );
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



}