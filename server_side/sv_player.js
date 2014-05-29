module.exports = function (id,index)
{
    this.id = id;    
    this.bets;
    this.card;
    this.score;  
    this.index = index;
    this.is_high_bet;      
    this.card_on_hand;
    this.is_main_player;
    this.is_card_played;
    this.curr_card_index;    

    this.init = function()
    {
        this.bet   = 0;
        this.score = 0;

        this.card = new Array(8);
        
        this.is_high_bet     = false;
        this.card_on_hand    = 0;    
        this.is_card_played  = false;  
        this.is_main_player  = false;
        this.curr_card_index = 0;    
    }
  
    this.setBet = function(value)
    {
        this.bet = value;  
    };

    this.getBet = function()
    {
        return this.bet;  
    };

    this.setCardPlayed = function(value)
    {
        this.is_card_played = value;  
    };
}