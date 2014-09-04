var PlatdujourView = Parse.View.extend({

    //... is a list tag.
    el:'#leplatdujour',

    // Cache the template function for a single item.
    template: _.template($('#platdujour-template').html()),

    events: {

    },

    initialize: function() {

    },

    render: function() {
        this.$el.html(this.template(this.model));
        return this;
    }


});