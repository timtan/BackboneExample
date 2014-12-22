(function(Backbone, _){
    'use strict';
    window.BombModel = Backbone.Model.extend({
        defaults:{
            hasBomb:false,
            number:0,
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
        toggleDoubt:function(){
            this.set({'gameState': (this.get('gameState') + 1 )% 2});
            return this;
        },
        isUnTouched:function(){
            return this.get('gameState') === 0;
        },
        isDoubt:function(){
            return this.get('gameState') === 1;
        },
        isExploded:function(){
            return this.get('gameState') === 2;
        },
        isClean:function(){
            return this.get('gameState') === 3;
        },
        handleOpen:function(){
            if(this.isDoubt()){
                return;
            }
            if(this.hasBomb()){
                this.set({gameState:2});
                this.trigger('bomb:exploded');
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
            if(random<23.6){
                return new this.model({hasBomb:true});
            }
            else{
                return new this.model({hasBomb:false});
            }
        },
        initialize:function(){
            this.exploded = false;
             this.listenTo(this,'bomb:exploded', function(){
                 this.exploded = true;
             });
        },
        _fillCount: function(){
            var width = this.width();
            console.log('width');
            console.log(width);
            var filterOutbound = function(item){
                var x = item[0];
                var y = item[1];
                return x >= 0 && x < width && y >= 0 && y < width;
            };
            for(var i = 0 ; i< width*width; ++i){
                var x = i % width;
                var y = parseInt(i / width);
                var surrendings = [
                    [x-1, y-1],
                    [x-1, y],
                    [x-1, y+1],
                    [x, y-1],
                    [x, y+1],
                    [x+1, y-1],
                    [x+1, y],
                    [x+1, y+1]
                ];
                console.log('i ' + i);
                console.log('x ' + x);
                console.log('y' + y);
                console.log(surrendings);
                surrendings = _.filter(surrendings,filterOutbound);
                var sum = 0;
                for(var j = 0; j< surrendings.length; ++j){
                    var surrendingX = surrendings[j][0];
                    var surrendingY = surrendings[j][1];
                    console.log(surrendingY);
                    console.log(surrendingX);
                    var model = this.at(surrendingY*width + surrendingX);
                    if(model.hasBomb()){
                       sum+=1;
                    }
                }
                var currentModel = this.at(y*width + x);
                currentModel.set({number:sum});

            }
        },
        fillModels: function(width){
            width = width || 10;
            this.reset();
            for(var i = 0 ; i< width*width; ++i){
                var model = this._makeModel();
                this.add(model);
            }
            this._fillCount();
        },
        width: function(){
            return Math.sqrt(this.length);
        },
        remaining: function(){
           return this.reduce(function(memo, model ){
               if(!model.hasBomb() && model.isUnTouched()){
                  return memo + 1;
               }
               return memo;
           }, 0);
        }
    });


    window.ButtonnView = Backbone.View.extend({
        template: _.template("<button class='BombBtn <%= btn %>' data-button><%=content%></button>"),
        events:{
            'click [data-button]': 'handleClick',
            'contextmenu [data-button]': 'handleRightClick'
        },
        className: 'BtnView',
        initialize:function(options){
            this.isLast = options.isLast;
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

            var attributes = this.model.attributes;
            var templateContext = {content:" "};
            if(this.model.isExploded()){
                templateContext.btn = 'btn-danger';
                templateContext.content = "X";
            }
            else if(this.model.isUnTouched()){
                templateContext.btn = 'btn-default';
            }
            else if(this.model.isDoubt()){
                templateContext.btn = 'btn-warning';
            }
            else if(this.model.isClean()){
                templateContext.btn = 'btn-success';
                templateContext.content = this.model.get('number');
            }

            var dom = this.template(_.extend(templateContext,attributes));
            this.$el.html(dom);
            if(this.isLast){
                this.$el.addClass('BtnView--last');
            }
            return this;
        }
    });

    window.GameView = Backbone.View.extend({
        childView : window.ButtonnView,
        render: function(){
            this.collection.each(function(model, index){
                var isLast = false;
                if( (index % this.collection.width()) === 0 ){
                    isLast = true;
                }
                var view = new this.childView({
                    model: model,
                    isLast: isLast
                });
                this.$el.append(view.render().el); // adding all the person objects.
            }, this);
        }
    });

    window.CountView = Backbone.View.extend({
        template: _.template('<%=remaining%>/<%=total%>'),
        initialize: function(){
            this.listenTo(this.collection,'change', this.render);
        },
        render: function(){
            var context = {
                remaining: this.collection.remaining(),
                total: this.collection.length
            };
            var dom = this.template(context);
            this.$el.html(dom);
            return this;
        }
    });
    window.Message = Backbone.View.extend({
        template: _.template('<%=message%>'),
        initialize: function(){
            this.listenTo(this.collection,'change', this.render);
            this.listenTo(this.collection,'bomb:exploded', this.render);
        },
        render: function(){
            var context = {message:""};
            if(this.collection.exploded){
                context.message = 'You Fail!!';
            }
            if(this.collection.remaining() === 0){
                context.message = 'Success !!';
            }
            var dom = this.template(context);
            this.$el.html(dom);
            return this;
        }
    });

})(window.Backbone, window._);
