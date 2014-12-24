(function(Backbone, _ ){
    'use strict';
    var BombModelState = {
        DEFAULT: 0,
        UNKNOWN: 1,
        EXPLODED: 2,
        CLEAN: 3
    };
    window.BombModel = Backbone.Model.extend({
        defaults:{
            hasBomb:false,
            number:0,
            gameState: BombModelState.DEFAULT
        },
        hasBomb:function(){
            return this.get('hasBomb');
        },
        toggleDoubt:function(){
            this.set({'gameState': (this.get('gameState') + 1 )% 2});
            return this;
        },
        isUnTouched:function(){
            return this.get('gameState') === BombModelState.DEFAULT;
        },
        isDoubt:function(){
            return this.get('gameState') === BombModelState.UNKNOWN;
        },
        isExploded:function(){
            return this.get('gameState') === BombModelState.EXPLODED;
        },
        isClean:function(){
            return this.get('gameState') === BombModelState.CLEAN;
        },
        handleOpen:function(){
            if(this.isDoubt()){
                return;
            }
            if(this.hasBomb()){
                this.set({gameState:BombModelState.EXPLODED});
                this.trigger('bomb:exploded');
            }
            else{
                this.set({gameState:BombModelState.CLEAN});
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
                surrendings = _.filter(surrendings,filterOutbound);
                var sum = 0;
                for(var j = 0; j< surrendings.length; ++j){
                    var surrendingX = surrendings[j][0];
                    var surrendingY = surrendings[j][1];
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
        numberOfSafe: function(){
           return this.reduce(function(memo, model ){
               if(!model.hasBomb() && model.isUnTouched()){
                  return memo + 1;
               }
               return memo;
           }, 0);
        }
    });


    window.ButtonnView = Backbone.View.extend({
        template: _.template(
            "<button class='BombBtn <%= btnClass %>' data-button><%=content%></button>"
        ),
        events:{
            'click [data-button]': 'handleClick',
            'contextmenu [data-button]': 'handleRightClick'
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


    var BombAwareView = Backbone.View.extend({
        initialize: function(){
            this.listenTo(this.collection,'all', this.render);
        }
    });

    window.CountView = BombAwareView.extend({
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

    window.Message = BombAwareView.extend({
        template: _.template('<%=message%>'),
        render: function(){
            var context = {message:""};
            if(this.collection.exploded){
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

})(window.Backbone, window._);
