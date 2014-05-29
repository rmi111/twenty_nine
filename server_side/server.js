var app    = require('express')(),
    server = require('http').createServer(app),
    io     = require('socket.io').listen(server);

io.set('log level', 1);

var socket;

var players ;

var curr_turn = 0;

var MAX_TURN_COUNT  = 4;

var MAX_ROUND_COUNT = 16;

var turn_count  = 0;

var round_count = 0;

var dist_count   = 0;

var bet_recieved = 0;

var player_index = 0;

var Player = require('./sv_Player.js');

var Card_Manager = require('./sv_card_manager.js');

var card_manager = new Card_Manager();

var Player_Manager = require('./sv_player_manager.js');

var player_manager = new Player_Manager();

var Card = require('./sv_card.js');

var Room = require('./rooms.js');

var room = [];

function init()
{
    players = [];

    player_manager.init();

    card_manager.init(io);

    card_manager.shuffleCard();

    for(var i = 0 ; i < 3 ; ++i)
    {
        room[i] = new Room(i);        
    }

    server.listen(8080);

    //addEventHandler();
}

init();

app.get('/', function (request, response)
{
    console.log('Welcome to SOCKET.IO');
});

io.sockets.on('connection', function (sockets)
{
    console.log("CONNECETD" + sockets);
   
    addEventHandler(sockets);
    
    //console.log(" Card Manager Returns : " + card_manager.getCard());        
});

function addEventHandler(sockets)
{   
    socket = sockets;
   
    sockets.on('room_join', handle_room_join);
    /*sockets.on('room_entered', handle_room_enter);
    sockets.on('new_player', handle_player_join);    
    sockets.on('card_played',handle_card_played);
    sockets.on('send_bet',handle_player_bet);
    sockets.on('trump_selected',handle_player_trumps);    
    sockets.on('distribution_end',handle_finish_card_distribution);    
    sockets.on('trump_reveal_status',handle_trump_reveal_status);*/  
}

function handle_room_join(data)
{
    //console.log('ENTERED ROOM :' + data.room_id);

    room[data.room_id].init(socket);

    //var msg = player_manager.getPlayerJoinStatus();

    //io.sockets.in(data.room_id).emit('room_join_success',  msg);
    
    //io.sockets.socket(this.id).emit('player_join_status',  msg );
}

function handle_room_enter(data)
{
    console.log('ENTERED ROOM');

    var msg = player_manager.getPlayerJoinStatus();

    io.sockets.socket(this.id).emit('player_join_status',  msg );
}

function handle_player_join(data)
{
    console.log(this.id);

    player_index = data.player_index;

    if(player_index > 3)
    {
        io.sockets.socket(this.id).emit('new_player_joined_failed',
                                         { msg: 'max player exceed!' });      
        
        return;
    }
    
    console.log("PLAYER JOINED" + data.msg);

    console.log("PLAYER INDEX : " + player_index);
    
    io.sockets.socket(this.id).emit('new_player_joined', { index: player_index });
    
    var player = new Player(this.id,player_index);

    player.init();

    player_manager.setPlayerJoinIndex(player_index);

    //players.push(player);
    players[player_index] = player;

    var result = [];

    var card_index = player_index;
    
    for (var i = 0 ; i < 4 ; ++i)
    {  
        result.push({card_index: i, suits: card_manager.cards[ card_index ].suits, sign: card_manager.cards[ card_index ].sign, cvalue: card_manager.cards[ card_index ].value});        
        
        var card = new Card();

        card.init(card_manager.cards[ card_index ].suits, card_manager.cards[ card_index ].sign, card_manager.cards[ card_index ].value);

        players[player_index].card[i] = card;

        players[player_index].card[i].onHand = true;

        players[player_index].card_on_hand++;

        card_index += 4;
    }
        
    console.log(result);

    io.sockets.socket(this.id).emit('recieve_prebet_card', result);   

    if(player_index < 4)
       player_index++;
    
    if(player_index > 3)
    {
        console.log("START BETTING");
        for(var i = 0 ; i < 4 ; ++i)
            io.sockets.socket(players[i].id).emit('start_bet_state', '');   
    }
}

function handle_card_played(data)
{
    console.log(data.player_index);
       
    var res = card_manager.addBoardCard(player_manager,data,players);
    
    console.log(data.player_index);
 
    if(res === true)        
    {
        console.log("PLAYER CARD " + data);
        this.broadcast.emit('new_card_played',data);
        
        ++turn_count;

        if(turn_count > MAX_TURN_COUNT - 1)
        {
             turn_count = 0;    
             
             player_manager.calculateWinner(card_manager);

             for(var i = 0 ; i < 4 ; ++i)
                 io.sockets.socket(players[i].id).emit('reset_turn', {turn_winner : player_manager.turn_winner}); 

             curr_turn = player_manager.turn_winner;         

             setTimeout(function()            
             {               
                 console.log('RESTART GAME');
                    
                 for(var i = 0 ; i < 4 ; ++i)
                     io.sockets.socket(players[i].id).emit('game_start', ''); 

                 //io.sockets.socket(players[player_manager.turn_winner].id).emit('player_turn', ''); 
                
             },600);
                         
             setTimeout(function()  
             {    
                 io.sockets.socket(players[player_manager.turn_winner].id).emit('player_turn', ''); 
             },2000);

            return;
        }

        curr_turn++

        if(curr_turn > 3)
        {
            curr_turn = 0;   
        }
    }
          
    console.log("TRUMP REVEALED : " + card_manager.trump_revealed);

    if(curr_turn != player_manager.turn_winner && card_manager.trump_revealed == false)    
    {                   
        var res = player_manager.checkTrump(card_manager,curr_turn);

        if(res == true)
        {
            io.sockets.socket(players[curr_turn].id).emit('reveal_trump', ''); 
            
            return;         
        }  
    }            

    io.sockets.socket(players[curr_turn].id).emit('player_turn', ''); 
}

function handle_trump_reveal_status(data)
{
    if(data.status)
    {
        card_manager.trump_revealed = true;                                        
      
        for(var i = 0 ; i < 4 ; ++i)    
        {
            io.sockets.socket(players[i].id).emit('trump_revealed', {'trump_index' : card_manager.trump_index});
        }
    }

    io.sockets.socket(players[curr_turn].id).emit('player_turn', ''); 
}

function handle_player_bet(data)
{
    console.log(data.player_index);
    
    ++bet_recieved;

    players[data.player_index].setBet(data.bet_score);
     
    if(bet_recieved > 3)
    {
        console.log("TO TRUMNP");

        player_manager.doBetEndAction(players,io);
    }
}

function handle_player_trumps(data)
{
    console.log("TRUMP SET");
    
    card_manager.setTrumps(data.trump_index,data.trump_suit);    

    for(var pindex = 0 ; pindex < 4; ++pindex)
    {
        var result = [];
    
        var card_index = pindex + 16;

        for (var i = 4 ; i < 8 ; ++i)
        {  
            result.push({card_index: i, suits: card_manager.cards[ card_index ].suits, sign: card_manager.cards[ card_index  ].sign, cvalue: card_manager.cards[ card_index ].value});        

            var card = new Card();

            card.init(card_manager.cards[ card_index ].suits, card_manager.cards[ card_index ].sign, card_manager.cards[ card_index ].value);
                        
            players[pindex].card[i] = card;

            players[pindex].card[i].onHand = true;

            players[pindex].card_on_hand++;

            card_index += 4;
        }  

        console.log(result);

        io.sockets.socket(players[pindex].id).emit('recieve_postbet_card', result);        
    }
}

function handle_finish_card_distribution(data)
{
    ++dist_count;

    curr_turn = player_manager.turn_winner;

    if(dist_count > 3)
    {
        dist_count = 0;
                  
        player_manager.players = players;
              
        player_manager.players[0].card = players[0].card;
        player_manager.players[1].card = players[1].card;
        player_manager.players[2].card = players[2].card;
        player_manager.players[3].card = players[3].card;

        this.broadcast.emit('game_start',data);

        io.sockets.socket(players[player_manager.turn_winner].id).emit('player_turn', ''); 
    }
}

io.sockets.on('joined', function (data)
{
    console.log(data);
});

