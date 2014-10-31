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
        _.bindAll(this,"saveArdoise","createNewArdoise",
            "addNewFormulePrice","showAddNewFormulePrice","hideAddNewFormulePrice","addFormulePrice",
            "addNewDishesBloc","showAddNewDishesBloc","hideAddNewDishesBloc","addDishesBloc");

        this.render();

        this.formulePricehelper = new ArdoiseFormulePriceHelper(this);
        this.dishesBlochelper = new ArdoiseDishesBlocHelper(this);

        app.resto.ardoiseOfDate.formulePriceList = new app.ArdoiseFormulePriceList();
        app.resto.ardoiseOfDate.dishesBlocList = new app.ArdoiseDishesBlocList();
        app.resto.ardoiseOfDate.formulePriceList.on('add', this.addFormulePrice);
        app.resto.ardoiseOfDate.dishesBlocList.on('add',this.addDishesBloc);

        if(this.options.modify){
            this.initFormulePriceListFromRelation();
            this.initDishesBlocListFromRelation();
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
    initDishesBlocListFromRelation:function(){
        this.dishesBlochelper.initDishesBlocListFromRelation();
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
                self.saveArdoiseWithLists(relationFPL,relationDBL,msgToShow);
            });
        }else{
            self.saveArdoiseWithLists(relationFPL,relationDBL, msgToShow);
        }
    },
    saveArdoiseWithLists:function(relationFPL,relationDBL, msgToShow){
        app.resto.ardoiseOfDate.formulePriceList.forEach (function (model) {
            if(!model.toBeRemoved){relationFPL.add(model);}
        });
        app.resto.ardoiseOfDate.dishesBlocList.forEach (function (model) {
            if(!model.toBeRemoved){relationDBL.add(model);}
        });
        app.resto.ardoiseOfDate.save().then(function(){
            showMsg(0,msgToShow);
        })
    }


});