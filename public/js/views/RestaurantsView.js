var RestaurantsView = Parse.View.extend({

    //... is a list tag.
    el: '.page',

    // Cache the template function for a single item.
    template: _.template($('#restos-template').html()),


    render : function(){

        var that=this;
        var restos = new Restaurants();
        restos.fetch({
            success:function(restos){
                that.$el.html(that.template({'resto': restos.models}));
            }
        })
    }
});

