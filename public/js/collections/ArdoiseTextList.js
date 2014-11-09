var app = app || {};

app.ArdoiseTextList = Parse.Collection.extend({

    model: app.ArdoiseText,

    getNextOrder: function () {
        if (!this.length) {
            return 1;
        }
        return this.last().get('order') + 1;
    },
    comparator: function (model) {
        return model.get('order');
    },
    notToBeRemovedList:function(){
        return this.filter(function(text){
            return !text.toBeRemoved;
        });
    }

});