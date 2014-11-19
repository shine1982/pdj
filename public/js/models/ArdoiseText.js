var app = app || {};

app.ArdoiseText = Parse.Object.extend({

    className:"ArdoiseText",

    defaults: {
        label: '',
        order: 1
    },
    label: function () {
        return this.get("label");
    }
});