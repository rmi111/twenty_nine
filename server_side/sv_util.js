module.exports = function() 
{
    this.shuffleArray = function(array)
    {
        var counter = array.length, temp, index;

        while (counter > 0) 
        {        
            index = Math.floor(Math.random() * counter);
    
            counter--;

            temp           = array[counter];
            array[counter] = array[index];
            array[index]   = temp;
        }

        return array;
    };

    this.getRandom = function(min,max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}