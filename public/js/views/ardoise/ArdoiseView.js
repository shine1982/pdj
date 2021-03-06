Parse.Events.listenTo = Parse.Events.on;
var app = app || {};
app.ArdoiseView = Parse.View.extend({

    template: _.template($('#ardoise-template').html()),

    importVisuTempl: doT.template($('#ardoise-import-visu-template').html()),

    tempArdoises:null,

    events: {
        //ardoise
        "click .btnCreateArdoise":'createNewArdoise',
        "blur #ardoiseTitle":'saveArdoiseTitle',

        //import ardoise
        "click #btnImportArdoise":'showImportArdoiseModal',
        "click #btnPreviousArdoise":'previousArdoise',
        "click #btnNextArdoise":'nextArdoise',
        "click #importArdoiseConfirm":'importArdoise',

        //formule price
        "click .showAddFormulePriceBtn":"showAddNewFormulePrice",
        "click .hideAddFormulePriceBtn":"hideAddNewFormulePrice",
        "click .addFormulePriceBtn":"addNewFormulePrice",

        //dishes bloc
        "click .showAddDishesBlocBtn":"showAddNewDishesBloc",
        "click .hideAddDishesBlocBtn":"hideAddNewDishesBloc",
        "click .addDishesBlocBtn":"addNewDishesBloc",

        //text
        "click .addTextBtn":"addNewText"
    },

    initialize: function() {
        _.bindAll(this, "createNewArdoise","searchArdoise","saveArdoiseToBase",
            "addNewFormulePrice","showAddNewFormulePrice","hideAddNewFormulePrice","addFormulePrice",
            "addNewDishesBloc","showAddNewDishesBloc","hideAddNewDishesBloc","addDishesBloc",
            "addText",
        "showImportArdoiseModal","renderImportArodoise","previousArdoise","nextArdoise","importArdoise","initAutoComplete");

        this.render();
        //TODO: to debug the autoComplete module by myself
        //this.initAutoComplete();

        this.formulePricehelper = new ArdoiseFormulePriceHelper(this);
        this.dishesBlochelper = new ArdoiseDishesBlocHelper(this);
        this.texthelper = new ArdoiseTextHelper(this);

        app.resto.ardoiseOfDate.formulePriceList = new app.ArdoiseFormulePriceList();
        app.resto.ardoiseOfDate.dishesBlocList = new app.ArdoiseDishesBlocList();
        app.resto.ardoiseOfDate.dishList = new app.ArdoiseDishList();
        app.resto.ardoiseOfDate.textList = new app.ArdoiseTextList();
        app.resto.ardoiseOfDate.formulePriceList.on('add', this.addFormulePrice);
        app.resto.ardoiseOfDate.dishesBlocList.on('add',this.addDishesBloc);
        app.resto.ardoiseOfDate.textList.on('add',this.addText);
        this.initLists();

    },

    initLists:function(){
        if(this.options.modify){
            this.initFormulePriceListFromRelation();
            this.initDishListFromRelation();//y compris dishesBloc
            this.initTextListFromRelation();
        }
    },

    initAutoComplete:function(){

        new AutoCompleteView({
            input: $("#ardoiseTextInput"),
            model: app.ArdoiseText,  //you only need the class here to init
            queryParameter: "label",  //the field to query
            onSelect: function (model) {
                alert("hello");
                //$("#selected").show().find("p").html(model.label());
            },
            highlight: "classname"	// optional, wrap keyword in <b class="classname"></b>
        }).render();
    },

    render: function() {
        this.$el.html( this.template(this.options));

        //petit controle sur un element parent:
        if(this.options.modify){
            $("#visuArdoiseBtn").show();
        }else{
            $("#visuArdoiseBtn").hide();
        }
        //et pour tooltip
        $('[data-toggle="tooltip"]').tooltip();
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
        /*
        var relationDL = app.resto.ardoiseOfDate.relation(app.constants.RELATION_DISH_LIST);
        relationDL.query().ascending("order").find({
            success:function(dishList){
                app.resto.ardoiseOfDate.dishList.add(dishList);
                return Parse.Promise.as();
            }
        }).then(function(){
            var relationDBL = app.resto.ardoiseOfDate.relation(app.constants.RELATION_DISHES_BLOC_LIST);
            relationDBL.query().ascending("order").find().then(function(results){
                app.resto.ardoiseOfDate.dishesBlocList.add(results);
            })
        })*/

        app.parseRelationHelper.initListFromRelation(app.resto.ardoiseOfDate.dishList,
            app.resto.ardoiseOfDate,
            app.constants.RELATION_DISH_LIST);

        app.parseRelationHelper.initListFromRelation(app.resto.ardoiseOfDate.dishesBlocList,
            app.resto.ardoiseOfDate,
            app.constants.RELATION_DISHES_BLOC_LIST);

    },

    /* zone text */
    initTextListFromRelation:function(){
        this.texthelper.initTextListFromRelation();
    },
    addText:function(text){
        this.texthelper.addText(text);

    },
    addNewText:function(e){
        this.texthelper.addNewText(e);
    },

    /* zone ardoise */
    createNewArdoise: function(e){

        e.preventDefault();
        var datejsForArdoise = this.getActuelDate();
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


    saveArdoiseTitle:function(e){
        e.preventDefault();
        app.resto.ardoiseOfDate.set("title", $("#ardoiseTitle").val());
        app.resto.ardoiseOfDate.save();
    },

    getActuelDate:function(){
        return moment($('#ardoiseDatepicker').val(), "DD/MM/YYYY").toDate();
    },

    saveArdoiseToBase:function(msgToShow){

        var datejsForArdoise = this.getActuelDate();
        var ardoiseTitle = $("#ardoiseTitle").val();

        var ardoise = app.resto.ardoiseOfDate;

        ardoise.set("resto",app.resto);
        ardoise.set("date",datejsForArdoise);
        ardoise.set("title",ardoiseTitle);
        ardoise.set(app.constants.RELATION_FORMULE_PRICE_LIST,app.resto.ardoiseOfDate.formulePriceList.toArray());
        ardoise.set(app.constants.RELATION_DISHES_BLOC_LIST,app.resto.ardoiseOfDate.dishesBlocList.toArray());
        ardoise.save().then(function(){
            showMsg(0,msgToShow);
        })


    },


    showImportArdoiseModal:function(e){
        e.preventDefault();
        var self=this;
        $("#importArdoiseModal").modal("show");

        var queryArdoise = new Parse.Query(app.Ardoise);
        queryArdoise.descending("date");
        queryArdoise.equalTo("resto",app.resto);
        queryArdoise.include(app.constants.RELATION_FORMULE_PRICE_LIST);
        queryArdoise.include(app.constants.RELATION_DISHES_BLOC_LIST);
        queryArdoise.include(app.constants.RELATION_DISH_LIST);
        queryArdoise.include(app.constants.RELATION_TEXT_LIST);
        queryArdoise.limit(20);
        queryArdoise.find().then(function(ardoises){
            if(ardoises.length>0){
                self.tempArdoises=ardoises;
                self.renderImportArodoise(ardoises);
            }else{
                $("#showArdoiseWaiting").html("No ardoise trouvé!");
            }
        })
    },
    renderImportArodoise:function(ardoises){
        var self = this;
        if(!app.resto.importVisuArdoiseIndex){
            app.resto.importVisuArdoiseIndex=0;
        }
        var ardoise = ardoises[app.resto.importVisuArdoiseIndex];
        var datejs = ardoise.get("date");
        var dateToShow = moment(datejs).format("DD/MM/YYYY");
        $("#tobeImportedArdoiseDate").val(dateToShow);
        self.tempFormulePriceList = new app.ArdoiseFormulePriceList();
        self.tempDishesBlocList = new app.ArdoiseDishesBlocList();
        self.tempDishList = new app.ArdoiseDishList();
        self.tempTextList = new app.ArdoiseTextList();

        self.tempFormulePriceList.add(ardoise.get(app.constants.RELATION_FORMULE_PRICE_LIST));
        self.tempDishesBlocList.add(ardoise.get(app.constants.RELATION_DISHES_BLOC_LIST));
        self.tempTextList.add(ardoise.get(app.constants.RELATION_TEXT_LIST));
        self.tempDishList.add(ardoise.get(app.constants.RELATION_DISH_LIST));

        $("#showImportArdoise").html(
            self.importVisuTempl(
                {titleArdoise:ardoise.get("title"),
                    formulePriceList:self.tempFormulePriceList.withPriceList(),
                    dishesBlocList: self.tempDishesBlocList.hasDishesList(self.tempDishList),
                    textList:self.tempTextList.toArray()})
        );

        for(var i=0; i<self.tempDishList.toArray().length; i++){
            var dish = self.tempDishList.toArray()[i];
            var priceToShow="";
            if(dish.get("priceEuro")!=""){
                priceToShow = "  " + dish.get('priceEuro')+" €";
            }
            $(".ardoiseVisu ."+dish.get("idDishesBloc")).append("<p>"+dish.get("label")+priceToShow+"</p>");
        }

        /*
        ardoise.relation("formulePriceList").query().find().then(
            function(results){
                self.tempFormulePriceList.add(results);
                return ardoise.relation("dishesBlocList").query().find();
        }).then(function(results){
                self.tempDishesBlocList.add(results);
                return ardoise.relation("textList").query().find();
        }).then(function(results){
                self.tempTextList.add(results);
                return ardoise.relation("dishList").query().find();
        }).then(function(results){
                self.tempDishList.add(results);
                return Parse.Promise.as();
         }).then(function(){
                $("#showImportArdoise").html(
                    self.importVisuTempl(
                        {titleArdoise:ardoise.get("title"),
                            formulePriceList:self.tempFormulePriceList.withPriceList(),
                            dishesBlocList: self.tempDishesBlocList.hasDishesList(self.tempDishList),
                            textList:self.tempTextList.toArray()})
                );

                for(var i=0; i<self.tempDishList.toArray().length; i++){
                    var dish = self.tempDishList.toArray()[i];
                    var priceToShow="";
                    if(dish.get("priceEuro")!=""){
                        priceToShow = "  " + dish.get('priceEuro')+" €";
                    }
                    $(".ardoiseVisu ."+dish.get("idDishesBloc")).append("<p>"+dish.get("label")+priceToShow+"</p>");
                }
         })*/
        //les deux buttons < >
        $("#btnNextArdoise").show();
        $("#btnPreviousArdoise").show();
        if(app.resto.importVisuArdoiseIndex === 0){
            $("#btnNextArdoise").hide();
        }
        if(app.resto.importVisuArdoiseIndex == ardoises.length -1){
            $("#btnPreviousArdoise").hide();
        }
    },
    previousArdoise: function (e) {
        e.preventDefault();
        if(app.resto.importVisuArdoiseIndex<this.tempArdoises.length-1){
            app.resto.importVisuArdoiseIndex++;
            this.renderImportArodoise(this.tempArdoises);
        }
    },
    nextArdoise:function(e){
        e.preventDefault();
        if(app.resto.importVisuArdoiseIndex>0){
            app.resto.importVisuArdoiseIndex--;
            this.renderImportArodoise(this.tempArdoises);
        }
    },

    importArdoise:function(e){
        e.preventDefault();
        var self= this;
        if(self.tempArdoises!=null && self.tempArdoises.length>0){
            var ardoiseAImporter = self.tempArdoises[app.resto.importVisuArdoiseIndex];
            var newArdoise = ardoiseAImporter.clone();
            newArdoise.set("date", this.getActuelDate());
            newArdoise.save().then(function(ardoise){
                app.resto.ardoiseOfDate = ardoise;
                $("#importArdoiseModal").modal("hide");
                self.options.modify=true;
                app.parseRelationHelper.saveRelationFromList(ardoise,self.tempFormulePriceList,app.constants.RELATION_FORMULE_PRICE_LIST);
                app.parseRelationHelper.saveRelationFromList(ardoise,self.tempDishesBlocList,app.constants.RELATION_DISHES_BLOC_LIST);
                app.parseRelationHelper.saveRelationFromList(ardoise,self.tempDishList,app.constants.RELATION_DISH_LIST);
                app.parseRelationHelper.saveRelationFromList(ardoise,self.tempTextList,app.constants.RELATION_TEXT_LIST);
                ardoise.save().then(function(){
                    self.parentView.trigger("dateArdoiseChange");
                    showMsg(0,"L'ardoise a été importé!");
                })
            })
        }
    }
});