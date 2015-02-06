(function(Marionette, Backbone, $, _){
    'use strict';
    window.TodoControlView = Marionette.ItemView.extend({
        template: "#todo-input",
        tagName: "form",
        events:{
            submit: 'handleSubmit'
        },
        handleSubmit: function(e){
            this.trigger("todo:input:submit", e.target.input.value);
            $(e.target.input).val("");
            return false;
        }
    });

    var TodoItemView = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'ListGroupItem',
        template: "#item",
        events:{
            'change': function(){
                this.model.set({
                    completed: !this.model.get('completed')
                });
            }
        }
    });

    var ClearedTodoItemView = TodoItemView.extend({
        className: 'ListGroupItem ListGroupItem--stripped'
    });

    var BaseTodoListView = Marionette.CollectionView.extend({
        tagName:'ul',
        className: 'ListGroup',
        getChildView: function(item){
            if(item.get('completed')){
                return ClearedTodoItemView;
            }
            return TodoItemView;
        }
    });

    window.TodoListView = BaseTodoListView.extend({
        initialize: function(){
            this.listenTo(this.collection,'change',this.render);
        }
    });

    var OptionView = Marionette.ItemView.extend({
        tagName: 'button',
        className : 'btn btn-default',
        template: _.template("<%=content%>"),
        modelEvents:{
            change: 'render'
        },
        events:{
            click: function(){
                this.model.trigger('clicked', this.model);
            }
        }
    });

    window.OptionsView = Marionette.CollectionView.extend({
        className: 'btn-group',
        childView: OptionView,
        template: false,
        initialize: function(){
            this.collection = new Backbone.Collection([
                {status: 'active', 'content':'all'},
                {status: 'inactive', 'content':'remaining'}
            ]);
            this.listenTo(this.collection, 'clicked', function(model){
                console.log(model);
                _.all()
            });

        }
    });

})(window.Marionette, window.Backbone, window.jQuery, window._);
