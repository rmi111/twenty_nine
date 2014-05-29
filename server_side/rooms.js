module.exports = function(id)
{
    var self = this;
    var socket;
    var players;
    var room_id = id;   
    var curr_turn = 0;
    var turn_count   = 0;
    var round_count  = 0;
    var dist_count   = 0;
    var bet_recieved = 0;
    var player_index = 0;
    var MAX_TURN_COUNT  = 4;
    var MAX_ROUND_COUNT = 16;
    var Player = require('./sv_Player.js');
    var Card_Manager = require('./sv_card_manager.js');
    var card_manager = new Card_Manager();
    var Player_Manager = require('./sv_player_manager.js');
    var player_manager = new Player_Manager();
    var Card = require('./sv_card.js');

    this.init = function(socketp)
    {
        socket = socketp;

        socket.join(room_id);

        socket.on('room_entered', handle_room_enter);
    }

    function handle_room_enter(data)
    {
        console.log('ENTERED ROOM ' + room_id);

        var msg = player_manager.getPlayerJoinStatus();

        socket.join(room_id);

        socket.in(room_id).emit('room_join_success',  room_id );
    }
}
