Parse.Events.listenTo = Parse.Events.on;
var ArdoiseFormulePriceView = Parse.View.extend({

    tagName:'div',
    tagClass:'form-group',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-formule-price-template').html()),

    events: {
       'focus .formulePriceInput': 'checkItem',
       'blur .formulePriceInput': 'uncheckItemIfEmpty',
       "click :checkbox":'clickCheckBox'
    },

    initialize: function(id) {
        _.bindAll(this,"render","checkItem","uncheckItemIfEmpty","clickCheckBox");
    },

    checkItem: function(e){
        if(!this.model.get("selected")){
            this.model.set("selected",true);
            this.$("input[type='checkbox']").prop('checked', true);
            if(!this.$el.find("input[type='text']").is(":focus")){
                this.$el.find("input[type='text']").focus();
            }
        }
    },

    uncheckItemIfEmpty: function(e){
        var inputEuroValue = this.$el.find("input[type='text']").val();
        var inputValueIsNumber=false;
        if(inputEuroValue!=""){
           inputEuroValue = parseInt(inputEuroValue);
            if(!_.isNaN(inputEuroValue)){
                inputValueIsNumber=true;
            }
        }

        if(!inputValueIsNumber){
            this.$el.find("input[type='text']").val("");
            this.model.set("selected",false);
            this.$("input[type='checkbox']").prop('checked', false);
        }
    },

    clickCheckBox: function(e){
        if(e.currentTarget.checked){
            if(!this.$el.find("input[type='text']").is(":focus")){
                this.$el.find("input[type='text']").focus();
            }
        }else{
            this.$el.find("input[type='text']").val("");
        }
    },

    render: function() {
        this.$el.html( this.template(this.model.attributes));
        return this;
    }
});