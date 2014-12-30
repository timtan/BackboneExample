(function(Backbone, _){
    'use strict';

    window.ButtonnView = Backbone.View.extend({
        template: _.template(
            "<button class='BombBtn <%= btnClass %>'><%=content%></button>"
        ),
        events:{
            'click': 'handleClick',
            'contextmenu': 'handleRightClick'
        },
        className: 'BtnView',
        initialize:function(){
            this.listenTo(this.model, 'change', this.render);
        },
        handleClick:function(){
            this.model.handleOpen();
        },
        handleRightClick:function(){
            this.model.toggleDoubt();
            return false;
        },
        render: function(){

            var templateContext = {
                btnClass: 'bt-default',
                content:" "
            };
            if(this.model.isExploded()){
                templateContext.btnClass = 'btn-danger';
                templateContext.content = "X";
            }
            else if(this.model.isUnTouched()){
                templateContext.btnClass = 'btn-default';
            }
            else if(this.model.isDoubt()){
                templateContext.btnClass = 'btn-warning';
            }
            else if(this.model.isClean()){
                templateContext.btnClass = 'btn-success';
                templateContext.content = this.model.get('number');
            }

            var dom = this.template(
                _.extend(templateContext,this.model.attributes)
            );

            this.$el.html(dom);
            return this;
        }
    });

    window.NewLineButtonView = window.ButtonnView.extend({
        className: "BtnView BtnView--last"
    });

    window.GameView = Backbone.View.extend({
        childView : window.ButtonnView,
        render: function(){
            this.$el.empty();
            this.collection.each(function(model, index){
                var ChildView = window.ButtonnView;
                if( (index % this.collection.width()) === 0 ){
                    ChildView = window.NewLineButtonView;
                }
                var view = new ChildView({
                    model: model
                });
                this.$el.append(view.render().el); // adding all the person objects.
            }, this);
        }
    });



    window.CountView = Backbone.View.extend({
        template: _.template('<%=remaining%>/<%=total%>'),
        render: function(){
            var context = {
                remaining: this.collection.numberOfSafe(),
                total: this.collection.length
            };
            var dom = this.template(context);
            this.$el.html(dom);
            return this;
        }
    });

    window.Message = Backbone.View.extend({
        template: _.template('<%=message%>'),
        render: function(){
            var context = {message:""};
            if(this.collection.isExploded()){
                context.message = 'You Fail!!';
            }
            if(this.collection.numberOfSafe() === 0){
                context.message = 'Success !!';
            }
            var dom = this.template(context);
            this.$el.html(dom);
            return this;
        }
    });

    window.NumberInput = Backbone.View.extend({
        events:{
           'submit': 'handleSubmit'
        },
        handleSubmit:function(e){
            this.trigger('numberInput:submit:number', e.target.number.value);
            return false;
        }
    });


})(window.Backbone, window._);
