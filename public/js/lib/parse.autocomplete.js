var AutoCompleteItemView = Parse.View.extend({
    tagName: "li",
    template: _.template('<a href="#"><%= label %></a>'),

    events: {
        "click": "select"
    },

    initialize: function(options) {
        this.options = options;
    },

    render: function () {
        this.$el.html(this.template({
            "label": this.highlight(this.model.label())
        }));
        return this;
    },

    highlight: function (label) {
        var op = this.options.parent;
        if (label && op.highlight && op.currentText) {
            label = label.replace(
                new RegExp(this.escapeRegExp(op.currentText), "gi"),
                function (matched) {
                    return '<b class="' + op.highlight + '">' + matched + '</b>'
                }
            );
        }
        return label;
    },

	escapeRegExp: function(str) {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
		return String(str).replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
	},

    select: function () {
        this.options.parent.hide().select(this.model);
        return false;
    }

});

var AutoCompleteView = Parse.View.extend({
    tagName: "ul",
    className: "autocomplete",
    wait: 300,

    queryParameter: "query",
    minKeywordLength: 2,
    currentText: "",
    itemView: AutoCompleteItemView,
    highlight: "",

    initialize: function (options) {
        _.extend(this, options);
        this.filter = _.debounce(this.filter, this.wait);
    },

    render: function () {
        // disable the native auto complete functionality
        this.input.attr("autocomplete", "off");

        this.$el.width(this.input.outerWidth());

        this.input
            .keyup(_.bind(this.keyup, this))
            .keydown(_.bind(this.keydown, this))
            .after(this.$el)
            .blur($.proxy(this.blur, this))
        ;

        return this;
    },

    keydown: function (event) {
        if (event.keyCode == 38) return this.move(-1);
        if (event.keyCode == 40) return this.move(+1);
        if (event.keyCode == 13) return this.onEnter();
        if (event.keyCode == 27) return this.hide();
    },

    blur: function() {
        this.hide();
    },

    keyup: function () {
        var keyword = this.input.val();
        if (this.isChanged(keyword)) {
            if (this.isValid(keyword)) {
                this.filter(keyword);
            } else {
                this.hide()
            }
            this.currentText = keyword; // tkes, moved here from loadResult
        }
    },

    //fetches results from parse
    filter: function (keyword) {
        var keyword = keyword.toLowerCase();
        var self = this;
        var query = new Parse.Query(self.model);
        // uses a startsWith query
        query.startsWith(this.queryParameter, keyword);
        self.collection = query.collection();
        self.collection.fetch({
            success: _.bind(function () {
                self.loadResult(self.collection.models, keyword);
            }, self)
        });
    },

    isValid: function (keyword) {
        return keyword.length > this.minKeywordLength
    },

    isChanged: function (keyword) {
        return this.currentText != keyword;
    },

    move: function (position) {
        var current = this.$el.children(".active"),
            siblings = this.$el.children(),
            index = current.index() + position;
        if (siblings.eq(index).length) {
            current.removeClass("active");
            siblings.eq(index).addClass("active");
        }
        return false;
    },

    onEnter: function () {
        this.$el.children(".active").click();
        return false;
    },

    loadResult: function (model, keyword) {
        this.show().reset();
        if (model.length) {
            _.forEach(model, this.addItem, this);
            this.show();
        } else {
            this.hide();
        }
    },

    addItem: function (model) {
        this.$el.append(new this.itemView({
            model: model,
            parent: this
        }).render().$el);
    },

    select: function (model) {
        var label = model.label();
        this.input.val(label);
        this.currentText = label;
        this.onSelect(model);
    },

    reset: function () {
        this.$el.empty();
        return this;
    },

    hide: function () {
        this.$el.hide();
        return this;
    },

    show: function () {
        this.$el.show();
        return this;
    },

    // callback definitions
    onSelect: function () {alert("hellow");}

});
