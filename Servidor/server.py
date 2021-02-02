import os
import json
from Game import Game, Spell
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, join_room, leave_room, send, emit
app = Flask(__name__)
app.config['SECRET_KEY'] = 'muito secreto'
socketio = SocketIO(app, cors_allowed_origins="*", cors_allowed_methods ='*',  cors_allowed_headers='*')

matching = ''
games = {}
users = {}

def add_game(player1, player2):
    print('Starting new game!')
    print('Player1: {}, Player2: {}'.format(player1,player2))
    gameID = player1 + player2
    users[player1] = {'enemy': player2, 'first': True, 'spell': None}
    users[player2] = {'enemy': player1, 'first': False, 'spell': None}
    join_room(gameID, player1)
    join_room(gameID, player2)
    games[gameID] = Game(player1, player2)
    buffed, debuffed = games[gameID].start_turn()
    emit('start_turn', json.dumps({'buffedLetter': buffed, 'debuffedLetter':debuffed}), to=gameID)
    print(f'Number of users: {len(users)}')
    print(f'Number of games: {len(games)}')
    # print(f'User: {users}')
    # print(f'Games: {games}')


@socketio.on('connect')
def connect():
    global matching
    if matching == '':
        matching = request.sid
        users[request.sid] = {'enemy': None, 'first': None, 'spell': None}
        print(f'User {matching} is waiting for an oponent!')
    else:
        add_game(matching, request.sid)
        matching = ''

@socketio.on('disconnect')
def disconnect():
    global matching
    userID = request.sid
    print(f'Disconnecting user {userID}!')
    if matching == userID:
        matching = ''

    if users[userID]['enemy']:
        enemyID = users[userID]['enemy']
        users[enemyID] = {'enemy': None, 'first': None, 'spell': None}
        print(f'user {enemyID} is waiting for an oponent!')
        gameID = userID + enemyID if users[userID]['first'] else enemyID+userID 
        leave_room(gameID, userID)
        leave_room(gameID, enemyID)
        users.pop(userID)
        games.pop(gameID)
        if matching == '':
            matching = enemyID
            print(f'User {matching} is waiting for an oponent!')
        else:
            add_game(matching, enemyID)
            matching = ''
    else:
        users.pop(userID)

    print(f'Number of users: {len(users)}')
    print(f'Number of games: {len(games)}')

buffed = 'A'
debuffed = 'B'

@socketio.on('end_turn')
def end_turn(data):
    print('------------------------------------------')
    global buffed
    global debuffed
    try:
        userID = request.sid
        enemyID = users[userID]['enemy']
        gameID = userID + enemyID if users[userID]['first'] else enemyID + userID
        print('userID: {}, first: {}, enemyID: {}, gameID: {}'.format(userID,users[userID]['first'], enemyID, gameID))
        print(f'Data from player:{data}')
        
        users[userID]['spell'] = data
        if users[enemyID]['spell'] != None:
            player1 = games[gameID].player1.id
            player2 = games[gameID].player2.id

            spell1 = users[player1]['spell']
            spell2 = users[player2]['spell']
            player1HP, player2HP, s1Index, s2Index = games[gameID].end_turn(spell1, spell2)
            print(f'player1HP:{player1HP}, spell:{s1Index}, player2HP:{player2HP}, spell:{s2Index}')
            emit('update_hp', json.dumps({'player':player1HP, 'enemy':player2HP, 'playerSpell': s1Index, 'enemySpell': s2Index}), to=player1)
            emit('update_hp', json.dumps({'player':player2HP, 'enemy':player1HP, 'playerSpell': s2Index, 'enemySpell': s1Index}), to=player2)
            users[player1]['spell'] = None
            users[player2]['spell'] = None

            buffed, debuffed = games[gameID].start_turn()
            emit('start_turn', json.dumps({'buffedLetter': buffed, 'debuffedLetter':debuffed}), to=gameID)
    except KeyError:
        print('Enemy disconnected')

if __name__ == '__main__':
    PORT = int(os.environ.get("PORT", 5000))
    print(f'abriu na porta {PORT}')
    socketio.run(app, host='0.0.0.0', port=PORT)
