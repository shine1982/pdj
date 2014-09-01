var DishView = Parse.View.extend({

    //... is a list tag.
    tagName:'tr',

    // Cache the template function for a single item.
    template: _.template($('#dish-template').html()),

    events: {
        'click .destroy': 'clear'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        this.model.bind('change', this.render);
    },

    render: function() {
        this.$el.html( this.template( this.model.attributes ));
        return this;
    },

    clear: function(){
        this.model.destroy();
        this.remove();
    }
});