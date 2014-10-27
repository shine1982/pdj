var app = app || {};
app.RestaurantManagementView = Parse.View.extend({

    el:'.page',

    template: _.template($('#restoManangement-template').html()),

    events: {

    },
    initialize: function() {
    },

    render: function(id,onglet) {
        this.$el.html( this.template({id:id,onglet:onglet}) );
        return this;
    }
});