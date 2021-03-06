var app = app || {};
app.ArdoiseTextView = Parse.View.extend({

    tagName:'div',
    className:'form-group',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-text-template').html()),

    events: {
       "click .clear":"removeItem",
       "click .textLabel": "startEditingMode",
       "blur .textLabelInput": "endEditingMode"

    },

    initialize: function() {
        _.bindAll(this,"render","removeItem");
        this.model.bind('change', this.render);
    },

    removeItem:function(item){
        app.parseRelationHelper.deleteItemFromRelation(app.resto.ardoiseOfDate,
            app.constants.RELATION_TEXT_LIST, app.resto.ardoiseOfDate.textList,this.model);
        this.remove();
    },

    startEditingMode:function(){
        this.$(".textLine").addClass("editing");
        this.$(".textLabelInput").focus();
    },
    endEditingMode:function(){
        this.$(".textLine").removeClass("editing");
        this.model.set("label", this.$(".textLabelInput").val());
        this.model.save();

    },

    render: function() {
        this.$el.html( this.template(this.model.attributes));
        return this;
    }
});