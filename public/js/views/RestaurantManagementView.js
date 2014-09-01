var RestaurantManagementView = Parse.View.extend({

    //... is a list tag.
    el:'.page',

    // Cache the template function for a single item.
    template: _.template($('#restoManangement-template').html()),

    // The DOM events specific to an item.
    events: {
       // 'submit form': 'saveResto'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        // this.listenTo(this.model, 'change', this.render);
    },

    render: function(id, onglet) {

        this.$el.html( this.template({id:id, onglet:onglet}) );
        return this;
    }
});