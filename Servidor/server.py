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
    playerID = request.sid
    print(f'Disconnecting user {playerID}!')
    if matching == playerID:
        matching = ''

    if users[playerID]['enemy']:
        enemyID = users[playerID]['enemy']
        users[enemyID] = {'enemy': '', 'first': None, 'spell': None}
        print(f'user {enemyID} is waiting for an oponent!')
        gameID = playerID + enemyID if users[playerID]['first'] else enemyID+playerID 
        leave_room(gameID, playerID)
        leave_room(gameID, enemyID)
        users.pop(playerID)
        games.pop(gameID)
        if matching == '':
            matching = enemyID
            print(f'User {matching} is waiting for an oponent!')
        else:
            add_game(matching, enemyID)
            matching = ''
    else:
        users.pop(playerID)

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
        playerID = request.sid
        enemyID = users[playerID]['enemy']
        gameID = playerID + enemyID if users[playerID]['first'] else enemyID+playerID
        print('playerID: {}, enemyID: {}, gameID: {}'.format(playerID, enemyID, gameID))
        print(f'Data from player:{data}')
        
        users[playerID]['spell'] = data
        if users[enemyID]['spell'] != None:
            if not users[playerID]['first']:
                temp = playerID
                playerID = enemyID
                enemyID = temp

            spell1 = users[playerID]['spell']
            spell2 = users[enemyID]['spell']
            enemyHP, playerHP, s1Index, s2Index = games[gameID].end_turn(spell1, spell2)
            print('playerHP = %s, enemyHp = %s'%(playerHP,enemyHP))
            emit('update_hp', json.dumps({'player':playerHP, 'enemy':enemyHP, 'playerSpell': s1Index, 'enemySpell': s2Index}), to=playerID)
            emit('update_hp', json.dumps({'player':enemyHP, 'enemy':playerHP, 'playerSpell': s2Index, 'enemySpell': s1Index}), to=enemyID)
            spell1 = users[enemyID]['spell'] = None
            spell2 = users[playerID]['spell'] = None

            buffed, debuffed = games[gameID].start_turn()
            emit('start_turn', json.dumps({'buffedLetter': buffed, 'debuffedLetter':debuffed}), to=gameID)
    except KeyError:
        print('Enemy disconnected')

if __name__ == '__main__':
    PORT = int(os.environ.get("PORT", 5000))
    print(f'abriu na porta {PORT}')
    socketio.run(app, host='0.0.0.0', port=PORT)
