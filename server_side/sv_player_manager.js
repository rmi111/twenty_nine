module.exports = function()
{
    var self = this;
    this.players;
    this.main_game;
    this.countTurn;
    this.totalTurn;
    this.playerTurn;    
    this.currentTurn;
    this.turn_winner;   
    this.curr_turn_winner;
    this.cardDistributed;
    this.toBet          = false;
    this.c_index        = 0;
    this.card_posX      = 300;
    this.card_posY      = 0;
    this.player_index   = 0;
    this.card_tick      = 0;    
    this.highBet        = 15;
    this.high_bet_index = 0;
    this.join_index     = [false,false,false,false];

    this.init = function(main_game)
    {
        this.players      = [];
        this.card_index   = 0;
        this.totalTurn    = 32;
        this.currentTurn  = 0;
        this.playerTurn   = 4;
        this.countTurn    = 0;
        this.cardDistributed = false;
        this.player_index = 0;
        this.turn_winner  = 0; 
        this.main_game    = main_game;
    };


    this.getCard = function(main,card_manager,cards,renderer)
    {
      /*  for(var i = 0 ; i < 8 ; ++i)           
        {
            this.player.card[i] = cards[ i ];            
                      
            this.player.card[i].setPos(this.card_posX , this.card_posY);
        
            this.player.card[i].setOnHand(true);         

            this.player.card_on_hand++ ;    
            
            this.card_posX  += 40 * i; 
                  
            this.card_posY  = (renderer.canvasHeight - 200); 
        }
  
     
        this.toBet = false;
        
        State = new STATES();
       
        this.cardDistributed = true;
           
        main.gameState = State.GAME_START; */
    };

    this.distribute = function(main,card_manager,cards,renderer)
    { 
        /*if(this.card_tick > 19) 
              if(this.toBet === false)              
                    self.distributeCards(main,card_manager,cards,renderer);

        if(this.card_tick < 20)
            ++this.card_tick;
        else
            this.card_tick = 0;*/
    };

    this.setOnHandCard = function(card_index,card,renderer)
    {         
        //this.card_posX  += 40;  
        
        this.card_posY  = (renderer.canvasHeight - 200); 

        this.player.card[card_index] = card;            
                      
        //this.player.card[card_index].setPos(this.card_posX , this.card_posY);
        
        this.player.card[card_index].setOnHand(true);         

        this.player.card_on_hand++ ; 
    }

    this.arrangeCard = function(renderer)
    {
        this.card_posX = 300;          

        this.card_posY  = (renderer.canvasHeight - 200); 

        for(i = 0 ; i < 8 ; ++i )
        {
            if(this.player.card[i] != null)
                this.player.card[i].setPos(this.card_posX , this.card_posY);

            this.card_posX += 40; 
        }
    }

    this.changeTurn = function()
    {
        if(this.currentTurn < 3)
            ++this.currentTurn ; 
        else
            this.currentTurn = 0; 
            
        if(this.countTurn < 3)
            ++this.countTurn;           
        else
        {
            this.countTurn = 0;          
            State = new STATES();
            this.main_game.gameState = State.ROUND_END;
        }          
    };
    
    
    this.playSuitCard = function(played_card,card_manager,player_index)
    {
         /* var play_card_score = 0;

          var max_score = 0,
              max_card_index = -1;

          for(var i = 0 ; i < this.player[player_index].card_on_hand ; ++i)
          {
              if(this.player[player_index].card[i].onHand != false && 
                 (this.player[player_index].card[i].getSuits() === played_card.getSuits()))
              {
                  if(this.player[player_index].card[i].value > played_card.value)
                  {
                      max_card_index = i;                  
                  }   
              }
          }

          if(max_card_index != -1)
          {
              this.updatePlayerState(player_index,max_card_index);
              card_manager.addCardOnBoard(player_index,this.player[player_index].card[max_card_index]);            
              this.changeTurn();
              return;
          }

          var min_card_value = 10,
              min_card_index = -1;

          for(var i = 0 ; i < this.player[player_index].card_on_hand ; ++i)
          {
              if(this.player[player_index].card[i].onHand != false && 
                 (this.player[player_index].card[i].getSuits() === played_card.getSuits()))
              {
                  if(this.player[player_index].card[i].value <= min_card_value)
                  {
                      min_card_value = this.player[player_index].card[i].value;
                      min_card_index = i;                  
                  }
              }
          }

          if(min_card_index != -1)
          {
              card_manager.addCardOnBoard(player_index,this.player[player_index].card[min_card_index]);             
              this.updatePlayerState(player_index,min_card_index);
              this.changeTurn();
          }*/
    };

    this.playCard = function(played_card,card_manager,player_index)
    {
          /*var max_score = -1,max_card_index = -1;

          for(var i = 0 ; i < this.player[player_index].card_on_hand ; ++i)
          {
              if (this.player[player_index].card[i].onHand != false && this.player[player_index].card[i].value > max_score)
              {
                  max_card_index = i;                  
              }                
          }

          if(max_card_index != -1)
          {
              this.updatePlayerState(player_index,max_card_index);
              card_manager.addCardOnBoard(player_index,this.player[player_index].card[max_card_index]);
              this.changeTurn();
              return;
          }*/
    };

    this.playTrumpCard = function (played_card, card_manager, player_index)
    {
        /*var min_score = 10, min_card_index = -1;

        for (var i = 0 ; i < this.player[player_index].card_on_hand ; ++i)
        {
            if( this.player[player_index].card[i].onHand == true)
            {
                if (this.player[player_index].card[i].suits == card_manager.trumps &&
                    this.player[player_index].card[i].value < min_score)
                {
                    min_card_index = i;
                    min_score = this.player[player_index].card[i].value;
                }
            }
        }

        if (min_card_index != -1)
        {
            this.updatePlayerState(player_index, min_card_index);
            card_manager.addCardOnBoard(player_index, this.player[player_index].card[min_card_index]);
            this.player[player_index].card[min_card_index].setOnHand(false);
            this.changeTurn();

            return;
        }
        else
        {
            for (var i = 0 ; i < this.player[player_index].card_on_hand ; ++i)
            {
                if (this.player[player_index].card[i].onHand == true)
                {
                    this.updatePlayerState(player_index, i);
                    this.player[player_index].card[i].setOnHand(false);
                    card_manager.addCardOnBoard(player_index, this.player[player_index].card[i]);
                    this.changeTurn();
                    return;
                }
            }
        }*/
    };

    this.checkTrump = function(card_manager,player_index)
    {         
        var played_card = card_manager.played_card;

        if (!this.checkPlayerCard(played_card, card_manager, player_index))        
        {   
            if (card_manager.trump_revealed != true)            
            {  
                return true;
            }            
        }

        return false;
    }

    this.checkPlayerCard = function(played_card,card_manager,player_index)
    {
        var i = 0 , isMatched = false;

        console.log("Player Index : " + player_index + " Cards Tot->  " + this.players[player_index].card_on_hand );
           
        for(var i = 0 ; i < this.players[player_index].card_on_hand; ++i)
        {               
            console.log( i + ". Suits: " + this.players[player_index].card[i].getSuits() + " ON HAND : " + this.players[player_index].card[i].onHand );

            if (this.players[player_index].card[i].onHand == true)
            {
                if (played_card.getSuits() == this.players[player_index].card[i].getSuits())
                {
                    isMatched = true;
                }
            }
        }
       
        return isMatched;
    }

    this.checkBoard = function(played_card,player_index)
    {
        var i = 0 , isMatched = false;
        
        console.log("ON HAND : " + this.players[player_index].card_on_hand);

        for(var i = 0 ; i < this.players[player_index].card_on_hand; ++i)
        {
            if (this.players[player_index].card[i].onHand == true)
            {
                if (played_card.getSuits() == this.players[player_index].card[i].getSuits())
                {                    
                    isMatched = true;
                    break;
                }
            }
        }
       
        return isMatched;
    }

    this.checkPlayedCard = function(choosen_card_data,card_manager)
    {         
        var played_card  = card_manager.played_card;

        console.log(choosen_card_data.player_index + " "  + choosen_card_data.card_index);

        var choosen_card = this.players[choosen_card_data.player_index].card[choosen_card_data.card_index];

        console.log(" Choosen Card : " + choosen_card.suits + " "  + choosen_card.sign);

        if(choosen_card.suits == played_card.suits)
        {   
            card_manager.addCardOnBoard(choosen_card_data.player_index, 
                                        this.players[choosen_card_data.player_index].card[choosen_card_data.card_index]);                         
                                    
            this.players[choosen_card_data.player_index].card[choosen_card_data.card_index].setOnHand(false); 

            return 1;    
        }
        else
        {
            if ( this.checkBoard(played_card,choosen_card_data.player_index) )   
            {            
                console.log("Must Play card in Suits");
                return 2;
            }                     
            else         
            {   
                if (card_manager.trump_revealed == true && this.players[choosen_card_data.player_index].card[choosen_card_data.card_index].suits == card_manager.trumps)                              
                {                        
                    this.curr_turn_winner = choosen_card_data.player_index;                 
                }
                
                this.players[choosen_card_data.player_index].card[choosen_card_data.card_index].setOnHand(false);
                       
                card_manager.addCardOnBoard(choosen_card_data.player_index, 
                                                    this.players[choosen_card_data.player_index].card[choosen_card_data.card_index]);
               
            } 
                
            return 3;
            
            //this.main_game.socket.emit('card_played',{player_index : this.player.player_index,card_sign : this.player.card[i].sign,card_suits :this.player.card[i].suits });           
        }  
   
    };  

    this.revealTrump = function(card_manager)
    {
        if (!card_manager.trump_revealed)
            card_manager.trump_revealed = true;
    }

    this.playerBet = function(main)
    {                  
        State = new STATES();
            
        main.gameState = State.BET_INPUT;            
           
        bets = prompt('Set your bet?');  
            
        while(bets < 16 || bets > 32)             
            bets = prompt('Set your bet?');  
            
        this.player.setBet(bets);
            
        main.gameState = State.BET_END; 
      
        /* else
        {
            var bet = getRandom(this.highBet,29);
            this.player[this.player_index].setBet(bet);

            if(bet > this.highBet)
            {
                this.highBet = bet;
                this.turn_winner = this.player_index;
                this.high_bet_index = this.player_index;
                this.player[this.player_index].is_high_bet = true;
            }
        }

        if(this.player_index == 3)
        {
            State = new STATES();
            main.gameState = State.BET_END;            
        }

        if(this.player_index >= 3)
        {
            State = new STATES();
            main.gameState = State.BET_END; 
            this.player_index = 0 ;
        }   
        else
        {
            ++this.player_index;            
        }

         this.currentTurn = this.turn_winner;*/
    };

    function getRandom(min,max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.calculateWinner = function(card_manager)
    {
       this.turn_winner = card_manager.findHeighestCard(self);     
    };

    this.resetRoundVar = function()
    {
        /*this.currentTurn = this.turn_winner;  
        State = new STATES();
        this.main_game.gameState = State.GAME_START;*/
    };

    this.doWinnerAction = function(card_manager,canvas)
    {
         //card_manager.moveCardToWinner(this.turn_winner,canvas);         
    };

    this.setPlayerIndex  = function(index)
    {        
        this.player.player_index = index;
    };

    this.getPlayerIndex  = function()
    {        
        return this.player.player_index ;
    };

    this.doBetEndAction = function(players,io)
    {    
        var bet = players[0].getBet();
        
        this.highBet           = bet;
        this.turn_winner       = 0;               
        this.high_bet_index    = 0;
        players[0].is_high_bet = true; 

        console.log("BET ( " + 0 + " ) : " + players[0].getBet());

        for(var i = 1 ; i < 4 ; ++i)            
        {    
             console.log("BET ( " + i + " ) : " + players[i].getBet());

             if(this.highBet < players[i].getBet())          
             {                
                 this.highBet = players[i].getBet();
                
                 this.turn_winner    = i;               
                 this.high_bet_index = i;
                
                 players[i].is_high_bet = true;            
             }                    
        }

        console.log("BET WINNER : " + this.high_bet_index);

        io.sockets.socket(players[this.high_bet_index].id).emit('bet_winner', {'high_bet_index' : this.high_bet_index});

        for(var i = 0 ; i < 4 ; ++i)            
        {
            if(i != this.high_bet_index)
                io.sockets.socket(players[i].id).emit('await_for_trump', {'':''});               
        }
    }

    this.setPlayerJoinIndex = function(index)
    {
        this.join_index[index] = true;
    }

    this.getPlayerJoinStatus = function()
    {
        var msg = {player_0 : this.join_index[0] , player_1 : this.join_index[1] , 
                   player_2 : this.join_index[2] , player_3 : this.join_index[3]};       

        return msg;
    }
};