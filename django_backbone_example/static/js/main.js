(function(Backbone, _){
    'use strict';
    window.BombModel = Backbone.Model.extend({
        default:{
            hasBomb:false,
            /*
                0: default
                1: unknown
                2: exploded
                3: clean
             */
            gameState:0
        },
        initialize:function(options){
            if(options.hasBomb){
                this.set({hasBomb:options.hasBomb});
            }
        },
        hasBomb:function(){
            return this.get('hasBomb');
        },
        setUnknown:function(){
            this.set({'gameState':1});
            return this;
        },
        isExploded:function(){
            return this.get('gameState') === 2;
        },
        isClean:function(){
            return this.get('gameState') === 3;
        },
        isDefault:function(){
            return this.get('gameState') === 0;
        },
        isUnknown:function(){
            return this.get('gameState') === 1;
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

    window.BombCollection = Backbone.Collection({
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
        initialize:function(options){
            var width = options.width|| 10;
            for(var i = 0 ; i< width*width; ++i){
                this.add(this._makeModel());
            }
        }
    });
    window.ButtonnView = Backbone.View.extend({

    });

})(window.Backbone, window._);
