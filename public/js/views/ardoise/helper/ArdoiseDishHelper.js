//une classe pour décharger un peu le ArdoiseView.js
function ArdoiseDishHelper(context){
    this.ctx = context;



    this.addNewDish=function(e, dishesBloc){
        e.preventDefault();
        var label = this.ctx.$(".addDishLabelInput").val();
        var price = this.ctx.$(".addDishPriceInput").val();
        var that = this;
        if(label!==''){

            app.parseRelationHelper.addToList(
                app.resto.ardoiseOfDate,
                app.constants.RELATION_DISH_LIST,
                label,
                price,
                app.ArdoiseDish,
                dishesBloc.dishList,
                function(item){
                    that.ctx.$(".addDishLabelInput").val('');
                    that.ctx.$(".addDishPriceInput").val('');
                },
                function(errNo){
                    if(errNo ===1){
                        alert("'"+label+"' déjà dans la liste!");
                    }
                },
                dishesBloc.id
            );
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
}