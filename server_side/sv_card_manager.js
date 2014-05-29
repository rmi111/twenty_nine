module.exports = function() 
{
    var Card = require('./sv_card.js');
    var Util = require('./sv_util.js');

    this.io;
    this.cards;
    this.trumps;    
    this.card_empty;
    this.trumps_icon;
    this.played_card;
    this.card_on_deck;
    this.card_on_table;
    this.shuffledCards;
    this.trump_revealed;
    this.suits = ["CLUBS", "HEART",  "SPADES","DIAMONDS"];
    this.card_sign = ["J", "9", "A", "10", "K", "Q", "8", "7"];
    this.card_values = [3, 2, 1, 1, 0, 0, 0, 0];
    //this.constants = new Constants();
    this.trump_index;

    this.init = function (io)
    {
        var count = 0;
        var signature = "C";

        this.io = io;
        this.trump_index = 0;        
        this.trump_revealed = false;
        this.cards = new Array(32);
        this.card_on_table = new Array(4);
        this.card_empty = false;        
        this.card_on_deck = 32;

        for (var i = 0 ; i < 4 ; ++i)
            this.card_on_table[i] = null;

        //get clubs card
        for (var i = 0 ; i < 8 ; ++i)
        {            
            var card = new Card();

            card.init(this.suits[0], this.card_sign[count], this.card_values[count]);

            this.cards[i] = card;

            ++count;
        }

        count = 0;
        signature = "H";

        //get diamond card
        for (var i = 8 ; i < 16 ; ++i)
        {        
            var card = new Card();

            card.init( this.suits[1], this.card_sign[count], this.card_values[count]);

            this.cards[i] = card;

            ++count;
        }

        count = 0;
        signature = "S";

        //get hearts card
        for (var i = 16 ; i < 24 ; ++i)
        {
            var card = new Card();

            card.init( this.suits[2], this.card_sign[count], this.card_values[count]);

            this.cards[i] = card;

            ++count;
        }

        count = 0;
        signature = "D";

        //get spades card
        for (var i = 24 ; i < 32 ; ++i)
        {           
            var card = new Card();

            card.init( this.suits[3], this.card_sign[count], this.card_values[count]);

            this.cards[i] = card;

            ++count;
        }
    };

    this.shuffleCard = function ()
    {
        this.shuffledCards = new Util().shuffleArray(this.cards);
        this.card_on_deck = 32;
    };

    this.decreaseCard = function ()
    {
        if (this.card_on_deck > 0)
            --this.card_on_deck;
        else
            this.card_empty = true;
    };

    this.trumpSelection = function (high_bet_index, player, main)
    {
        if (high_bet_index == 0)
        {
            State = new STATES();
            main.gameState = State.PLAYER_TRUMP_SELECTION;
        }
        else
        {
            this.trump_index = new Util().getRandom(0, 3);
            this.trumps = this.suits[this.trump_index];
            main.gameState = State.TRUMP_SELECTION_END;
        }
    };

    this.addCardOnBoard = function (player_index, card)
    {
         this.card_on_table[player_index] = card;
    };

    this.getBoardCard = function (turn_winner)
    {
        return this.card_on_table[turn_winner];
    }

    this.checkCardToPlay = function (winner_card)
    {

    };

    this.getPlayedCard = function (player_index)
    {
        return this.card_on_table[player_index];
    };

    this.clearCardOnBoard = function ()
    {
        for (var i = 0 ; i < 4 ; ++i)
            this.card_on_table[i] = null;
    };

    this.findHeighestCard = function (player_manager)
    {
        var played_card  = this.played_card;
        var winner_index = player_manager.turn_winner;
        var max_value    = played_card.value;
        var trump_value  = -1;

        for (var i = 0; i < 4 ; ++i)
        {
            if (this.trump_revealed)
            {
                if (this.card_on_table[i].suits == this.trumps &&
                    this.card_on_table[i].value > trump_value)
                {
                    trump_value = this.card_on_table[i].value;
                    winner_index = i;
                }
                if (i != player_manager.turn_winner &&
                    this.card_on_table[i].suits == played_card.suits)
                {
                    if (this.card_on_table[i].value > max_value)
                    {
                        max_value = this.card_on_table[i].value;
                        winner_index = i;
                    }
                }
            }
            else
            {
                if ( this.card_on_table[i] != null && 
                    (i != player_manager.turn_winner && this.card_on_table[i].suits == played_card.suits))
                {
                    if (this.card_on_table[i].value > max_value)
                    {
                        max_value    = this.card_on_table[i].value;
                        winner_index = i;
                    }
                }
            }            
        }

        return winner_index;
    };
    
    this.addBoardCard = function(player_manager, card_data, players)
    {
        var card = this.getCard(card_data.card_suits,card_data.card_sign);
        
        console.log("INDEX : " + card_data.player_index  + " T WINNER : " + player_manager.turn_winner);

        if(card_data.player_index == player_manager.turn_winner)            
        {          
            this.addCardOnBoard(card_data.player_index,card);
            
            players[card_data.player_index].card[card_data.card_index].onHand = false;

            console.log("FROM WINNED PLAYER");

            this.played_card = card;

            this.io.sockets.socket(players[card_data.player_index].id).
                            emit('played_card_success', {'STATUS' : 'SUCCESS'});
            
            return true;          
        }
        else
        {
            var msg    = '';
            var status = player_manager.checkPlayedCard(card_data,this);
            
            switch(status)
            {
                case 1:
                case 3:
                    msg = {'STATUS': 'SUCCESS'};
                    this.io.sockets.socket(players[card_data.player_index].id).emit('played_card_success', msg);
                    break;
                case 2:
                    msg = {'STATUS': 'FAILED','MSG':'Must Choose The Card In Same Suits'};
                    this.io.sockets.socket(players[card_data.player_index].id).emit('played_card_failed', msg);
                    break;
            }
            
            return true;          
        }

        return false;
    };

    this.getCard = function(card_suits,card_sign)
    {
        for(var i = 0 ; i < 32 ; ++i)
        {
            if(this.cards[i].suits === card_suits && this.cards[i].sign == card_sign)
                return this.cards[i];
        }

        return this.cards[0];
    };

    this.setTrumps = function(trump_index,trump_suits)
    {           
        this.trump_index = trump_index;
           
        this.trumps      = trump_suits;
    }
};