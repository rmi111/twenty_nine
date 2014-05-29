module.exports = function()
{   
    this.sign; 
    this.value;  
    this.suits;     
    this.cardId;    
    this.onHand;     
    this.isOutOfBoundary;
        
    this.init = function(suits,sign,value)
    {
        this.sign            = sign;
        this.value           = value;
        this.suits           = suits;
        this.cardId          = suits + sign;       
        this.cardOutHand     = false;     
        this.isOutOfBoundary = false;
    };   

    this.setOnHand = function(value)
    {
      
        this.onHand = value;  
    };

    this.getSuits = function()
    {
        return this.suits;
    };
}
