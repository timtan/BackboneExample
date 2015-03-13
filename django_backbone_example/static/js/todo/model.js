(function(Backbone, $, _){
    'use strict';
    window.TodoModel = Backbone.Model.extend({
        defaults:{
            completed: false,
            content: ""
        }
    });

    window.TodoCollection = Backbone.Collection.extend({
        model: window.TodoModel,
        url: "/api/todo",
        comparator: 'completed',
        initialize: function(){
            this.listenTo(this, "change:completed", this.sort);
        }
    });

})(window.Backbone, window.jQuery, window._);
