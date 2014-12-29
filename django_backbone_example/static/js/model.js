(function(Backbone, _, $ ){
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
            this.reset();
            width = width || 10;
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
        },
        isExploded:function(){
            return this.reduce(function(memo, model ){
                return model.isExploded() || memo;
            }, false);
        }
    });

})(window.Backbone, window._, window.$);
