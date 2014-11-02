Parse.Events.listenTo = Parse.Events.on;
var app = app || {};
app.ArdoiseView = Parse.View.extend({

    template: _.template($('#ardoise-template').html()),

    events: {
        //ardoise
        "click #saveArdoiseBtn":'saveArdoise',
        "click .btnCreateArdoise":'createNewArdoise',

        //formule price
        "click .showAddFormulePriceBtn":"showAddNewFormulePrice",
        "click .hideAddFormulePriceBtn":"hideAddNewFormulePrice",
        "click .addFormulePriceBtn":"addNewFormulePrice",

        //dishes bloc
        "click .showAddDishesBlocBtn":"showAddNewDishesBloc",
        "click .hideAddDishesBlocBtn":"hideAddNewDishesBloc",
        "click .addDishesBlocBtn":"addNewDishesBloc"
    },

    initialize: function() {
        _.bindAll(this,"saveArdoise","createNewArdoise","searchArdoise","updateLists","saveArdoiseToBase","saveArdoiseWithLists",
            "addNewFormulePrice","showAddNewFormulePrice","hideAddNewFormulePrice","addFormulePrice",
            "addNewDishesBloc","showAddNewDishesBloc","hideAddNewDishesBloc","addDishesBloc",
            "addDish");

        this.render();

        this.formulePricehelper = new ArdoiseFormulePriceHelper(this);
        this.dishesBlochelper = new ArdoiseDishesBlocHelper(this);

        app.resto.ardoiseOfDate.formulePriceList = new app.ArdoiseFormulePriceList();
        app.resto.ardoiseOfDate.dishesBlocList = new app.ArdoiseDishesBlocList();
        app.resto.ardoiseOfDate.dishList = new app.ArdoiseDishList();
        app.resto.ardoiseOfDate.formulePriceList.on('add', this.addFormulePrice);
        app.resto.ardoiseOfDate.dishesBlocList.on('add',this.addDishesBloc);
        app.resto.ardoiseOfDate.dishList.on('add',this.addDish);
        if(this.options.modify){
            this.initFormulePriceListFromRelation();
            this.initDishListFromRelation();//y compris dishesBloc
        }


    },

    render: function() {
        this.$el.html( this.template(this.options));
        return this;
    },

    /* Zone Formule Price */
    initFormulePriceListFromZero:function(callback){
        this.formulePricehelper.initFormulePriceListFromZero(callback);
    },
    initFormulePriceListFromRelation:function(){
        this.formulePricehelper.initFormulePriceListFromRelation();
    },
    addNewFormulePrice:function(e){
        this.formulePricehelper.addNewFormulePrice(e);
    },
    showAddNewFormulePrice:function(e){
        this.formulePricehelper.showAddNewFormulePrice(e);
    },
    hideAddNewFormulePrice:function(e){
        this.formulePricehelper.hideAddNewFormulePrice(e);
    },
    addFormulePrice:function(ardoiseFormulePrice){
        this.formulePricehelper.addFormulePrice(ardoiseFormulePrice);

    },

    /* Zone Dishes Bloc */
    initDishesBlocListFromZero:function(callback){
        this.dishesBlochelper.initDishesBlocListFromZero(callback);
    },
    addNewDishesBloc:function(e){
        this.dishesBlochelper.addNewDishesBloc(e);
    },
    showAddNewDishesBloc:function(e){
        this.dishesBlochelper.showAddNewDishesBloc(e);
    },
    hideAddNewDishesBloc:function(e){
        this.dishesBlochelper.hideAddNewDishesBloc(e);
    },
    addDishesBloc:function(ardoiseDishesBloc){
        this.dishesBlochelper.addDishesBloc(ardoiseDishesBloc);

    },

    /* Zone dish */
    initDishListFromRelation:function(){
        var relationDBL = app.resto.ardoiseOfDate.relation("dishesBlocList");
        relationDBL.query().ascending("order").find().then(function(results){
            app.resto.ardoiseOfDate.dishesBlocList.add(results);
            return Parse.Promise.as();
        }).then(function(){
            var relationDL = app.resto.ardoiseOfDate.relation("dishList");

            relationDL.query().ascending("order").find({
                success:function(dishList){
                    app.resto.ardoiseOfDate.dishList.add(dishList);
                }
            })
        })
    },
    addDish:function(dish){
        var ardoiseDishView = new app.ArdoiseDishView({model:dish});
        $("#zoneDishesBlocs ."+dish.get("idDishesBloc")+" .showAddDishBtn").before(ardoiseDishView.render().el);
    },

    /* zone ardoise */
    createNewArdoise: function(e){

        e.preventDefault();
        var datejsForArdoise = moment($('#ardoiseDatepicker').val(), "DD/MM/YYYY").toDate();
        var that = this;
        this.searchArdoise(datejsForArdoise, function(hasAlreadyArdoise){
            if(hasAlreadyArdoise){
                showMsg(3,"l'ardoise de cette date existe déjà");
            }else{
                that.options.modify=true;
                that.render();
                that.initFormulePriceListFromZero(
                    function(){
                        that.initDishesBlocListFromZero(
                            function(){
                                that.saveArdoiseToBase("Vous venez de créer votre ardoise, modifiez la dés maintenant pour adapter la réalité de votre restaurant!");
                            }
                        );

                    }
                );
            }
        });

    },

    searchArdoise:function(jsDateSelected, callback){

    var queryArdoise = new Parse.Query(app.Ardoise);
    queryArdoise.equalTo("resto", app.resto);
    queryArdoise.equalTo("date",jsDateSelected);
    queryArdoise.find().then(
        function(ardoises){
            if(ardoises.length>0){
                app.resto.ardoiseOfDate =ardoises[0];//donc ardoise existe déjà, c'est une mise à jour
                callback(true);
            }else{
                callback(false);
            }
        },
        function(error){
            showMsg(3,error.message);
        });
    },


    saveArdoise:function(e){
        e.preventDefault();
        this.saveArdoiseToBase("L'ardoise a été sauvegardé pour la date "+ $('#ardoiseDatepicker').val());

    },
    saveArdoiseToBase:function(msgToShow){

        var datejsForArdoise = moment($('#ardoiseDatepicker').val(), "DD/MM/YYYY").toDate();
        var ardoiseTitle = $("#ardoiseTitle").val();

        var ardoise = app.resto.ardoiseOfDate;

        ardoise.set("resto",app.resto);
        ardoise.set("date",datejsForArdoise);
        ardoise.set("title",ardoiseTitle);

        this.updateLists(this.options.modify,msgToShow);
    },
    updateLists:function(modify, msgToShow)
    {

        var self=this;
        var relationFPL = app.resto.ardoiseOfDate.relation("formulePriceList");
        var relationDBL = app.resto.ardoiseOfDate.relation("dishesBlocList");
        var relationDL = app.resto.ardoiseOfDate.relation("dishList");

        if(modify && app.resto.ardoiseOfDate.id){//on commence par netroyer
            relationFPL.query().find().
            then(function(results){
                relationFPL.remove(results);
                return Parse.Promise.as();
            }).then(function(){
                return relationDBL.query().find();
             }).then(function(results){
                    relationDBL.remove(results);
                    return Parse.Promise.as();
            }).then(function(){
                    return relationDL.query().find();
                }).then(function(results){
                    relationDL.remove(results);
                    return Parse.Promise.as();
            }).then(function(){
                self.saveArdoiseWithLists(relationFPL,relationDBL,relationDL, msgToShow);
            });
        }else{
            self.saveArdoiseWithLists(relationFPL,relationDBL,relationDL, msgToShow);
        }
    },
    saveArdoiseWithLists:function(relationFPL,relationDBL,relationDL, msgToShow){

        app.resto.ardoiseOfDate.formulePriceList.forEach (function (model) {
            if(!model.toBeRemoved){relationFPL.add(model);}
        });

        app.resto.ardoiseOfDate.dishesBlocList.forEach (function (model) {
            if(!model.toBeRemoved){relationDBL.add(model);}
        });

        app.resto.ardoiseOfDate.dishList.forEach (function (model) {
            if(!model.toBeRemoved){relationDL.add(model);}
        });


        app.resto.ardoiseOfDate.save().then(function(){
            showMsg(0,msgToShow);
        })
    }


});