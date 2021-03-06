(function(Marionette, Backbone, $, _){
    'use strict';

    window.TodoInputView = Marionette.ItemView.extend({
        template: "#todo-input",
        events:{
            "submit form": 'handleSubmit'
        },
        handleSubmit: function(e){
            this.state.trigger("content:submit", e.target.input.value);
            $(e.target.input).val("");
            return false;
        },
        initialize: function(option){
            this.state = option.state;
        }
    });

    var EmptyView = Marionette.ItemView.extend({
        template: _.template("<p> 起始中</p>")
    });

    var TodoItemView = Marionette.ItemView.extend({
        template: "#item",
        events:{
            'change': function(){
                this.model.set({
                    completed: !this.model.get('completed')
                });
            }
        },
        initialize: function(option){
            this.state = option.state;
            this.listenTo(this.model, "change", this.render);
            this.listenTo(this.state, "change", this.render);
        },
        onRender: function(){
            if(this.state.get("status") === 'complete'){
                if(!this.model.get("completed")){
                    this.$el.hide();
                    return;
                }
            }
            if(this.state.get("status") === 'remaining'){
                if(this.model.get("completed")){
                    this.$el.hide();
                    return;
                }
            }
            this.$el.show();
            if(this.model.get("completed")){
                this.$(".ListGroupItem").addClass("ListGroupItem--stripped");

            }
            else{
                this.$(".ListGroupItem").removeClass("ListGroupItem--stripped");
            }
        }
    });


    window.TodoListView = Marionette.CollectionView.extend({
        className: 'ListGroup',
        childView: TodoItemView,
        emptyView: EmptyView,
        childViewOptions: function(){
            return {
                state: this.state
            };
        },
        initialize: function(option){
            this.state = option.state;
            this.listenTo(this.collection,'change',this.render);
        }
    });


    var OptionView = Marionette.ItemView.extend({
        tagName: 'button',
        className : 'btn btn-default',
        template: _.template("<%=content%>"),
        events:{
            click: function(){
                this.state.set({
                    status: this.model.get("status")
                });
            }
        },
        initialize: function(option){
            this.state = option.state;
            this.listenTo(this.state, 'change', this.render);
        },
        onRender: function(){
            if(this.model.get("status") === this.state.get("status")) {
               this.$el.addClass("btn-info");
            }
            else{
                this.$el.removeClass("btn-info");
            }
        }
    });

    window.OptionsView = Marionette.CollectionView.extend({
        className: 'btn-group',
        childView: OptionView,
        template: false,
        childViewOptions: function(){
            return {
                state: this.state
            };
        },
        initialize: function(option){
            this.state = option.state;
            this.collection = new Backbone.Collection([
                {status: 'all', 'content':'all'},
                {status: 'complete', 'content':'complete'},
                {status: 'remaining', 'content':'remaining'},
                {status: 'postpone', 'content':'postpone'},
            ]);
        }
    });

})(window.Marionette, window.Backbone, window.jQuery, window._);
