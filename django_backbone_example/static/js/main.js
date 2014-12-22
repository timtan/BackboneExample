(function(Backbone, _){
    'use strict';
    window.BombModel = Backbone.Model.extend({
        defaults:{
            hasBomb:false,
            /*
                0: default
                1: unknown
                2: exploded
                3: clean
             */
            gameState:0
        },
        hasBomb:function(){
            return this.get('hasBomb');
        },
        setUnknown:function(){
            this.set({'gameState':1});
            return this;
        },
        isUnTouched:function(){
            return this.get('gameState') === 0;
        },
        isUnknown:function(){
            return this.get('gameState') === 1;
        },
        isExploded:function(){
            return this.get('gameState') === 2;
        },
        isClean:function(){
            return this.get('gameState') === 3;
        },
        handleOpen:function(){
            if(this.hasBomb()){
                this.set({gameState:2});
            }
            else{
                this.set({gameState:3});
            }
        }
    });

    window.BombCollection = Backbone.Collection.extend({
        model: window.BombModel,
        _makeModel: function(){
            var random = _.random(0,100);
            if(random<66.6){
                return new this.model({hasBomb:true});
            }
            else{
                return new this.model({hasBomb:false});
            }
        },
        fillModels: function(width){
            width = width || 10;
            this.reset();
            for(var i = 0 ; i< width*width; ++i){
                var model = this._makeModel();
                this.add(model);
            }
        },
        width: function(){
            return Math.sqrt(this.length);
        }
    });


    window.ButtonnView = Backbone.View.extend({
        template: _.template("<button class='BombBtn <%= btn %>' data-button></button>"),
        events:{
            'click [data-button]': 'handleClick'
        },
        className: "BtnView",
        initialize:function(){
            this.listenTo(this.model, 'change', this.render);
        },
        handleClick:function(){
            this.model.handleOpen();
        },
        render: function(){

            var attributes = this.model.attributes;
            var templateContext = {};
            if(this.model.isExploded()){
                templateContext.btn = 'btn-danger';
            }
            else if(this.model.isUnTouched()){
                templateContext.btn = 'btn-default';
            }
            else if(this.model.isClean()){
                templateContext.btn = 'btn-success';
            }

            var dom = this.template(_.extend(templateContext,attributes));
            this.$el.html(dom);
            return this;
        }
    });

    window.GameView = Backbone.View.extend({
        childView : window.ButtonnView,
        render: function(){
            this.collection.each(function(model, index){
                var className = 'BtnView ';
                if( (index % this.collection.width()) === 0 ){
                    className += 'BtnView--last';
                }
                var view = new this.childView({
                    model: model,
                    className: className
                });
                this.$el.append(view.render().el); // adding all the person objects.
            }, this);
        }
    });

})(window.Backbone, window._);
