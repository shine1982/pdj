var app = app || {};
app.RestaurantsView = Parse.View.extend({

    el: '.page',

    template: _.template($('#restos-template').html()),

    initialize:function(){
        _.bindAll(this,"addOne","addAll","render");
        this.render();
        var query = new Parse.Query(app.Restaurant);
        query.descending("createdAt");
        app.restos = query.collection();
        app.restos.on('add',this.addOne);
        app.restos.on('reset', this.addAll);
        app.restos.fetch();

    },

    addOne: function( resto ) {
        var view = new app.RestaurantsItemView({ model: resto });
        $("#restosTable tbody").append( view.render().el );
    },
    addAll: function( restos ) {
        $("#restosTable tbody").empty();
        app.restos.each(this.addOne, this);
    },

    render : function(){
        this.$el.html(this.template());
    }
});

app.RestaurantsItemView = Parse.View.extend({

    tagName:"tr",
    template: _.template($('#restos-oneItem-template').html()),
    render : function(){
        this.$el.html(this.template(_.extend(this.model.attributes, {id:this.model.id})) );
        return this;
    }
});

