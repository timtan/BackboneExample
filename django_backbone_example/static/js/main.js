(function(Backbone, _ ){
    'use strict';
    window.app = {
        init:function(){
            this.bombs = new window.BombCollection();

            this.numberInput = new window.NumberInput({
                el: '#number-submit-form'
            });
            this.gameView = new window.GameView({
                el:'#mine',
                collection:this.bombs
            });
            this.counterView = new window.CountView({
                el:'#count',
                collection:this.bombs
            });
            this.messageView = new window.Message({
                el:'#message',
                collection: this.bombs
            });

            this.listenTo(this.numberInput,"numberInput:submit:number",function(number){
                this.bombs.fillModels(number);
                this.showAll();
            });
            this.listenTo(this.bombs, "change:gameState",function(){
                this.showCounter();
                this.showMessage();
            });
        },
        showAll:function(){
            this.gameView.render();
            this.showCounter();
            this.showMessage();
        },
        showMessage:function(){
            this.messageView.render();
        },
        showCounter:function(){
            this.counterView.render();
        }

    };
    _.extend(window.app, Backbone.Events);

})(window.Backbone, window._);
