import asyncio
import websockets
import json
import os
import cv2
import pathlib
import platform

from fastai.tabular.all import *
import math

if platform.system() == 'Windows':
    print('Windows')
    temp = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath

path = Path()
path.ls(file_exts='.pkl')
learn_inf = load_learner(path/'fullNomalizados.pkl')
vocab = learn_inf.dls.vocab
print(vocab)

clients = set()

PORT = int(os.environ.get("PORT", 3000))
print(f'abriu na porta {PORT}')


async def server(websocket, path):
    # Register.
    clients.add(websocket)
    print(clients)
    # await websocket.send('conectado')
    '''bigx = 0
    bigy = 0
    smallx = 0
    smally = 0'''
    blank_image = np.zeros((200,200,3), np.uint8)
    cv2.imshow('MediaPipe Hands', blank_image)
    try:
        async for message in websocket:
            #print("that was the message")
            
            if len(message) > 2:
                message = message[1:-1]
                data = json.loads(message)
                #print(json.dumps(data,indent=4))
                points = []
                blank_image = np.zeros((200,200,3), np.uint8)
                #print("$$$$$$",len(data['landmarks']),"$$$$$$$")
                print(type(data['landmarks']))
                for p in data['landmarks']:
                    '''x = math.floor(p[0])
                    y = math.floor(p[1])
                    if bigx < x:
                        bigx = x
                    if bigy < y:
                        bigy = y
                    if smallx > x:
                        smallx = x
                    if smally > y:
                        smally = y
                    print(bigx,bigy,"----",smallx,smally)'''
                    points.append(p[0]/200)
                    points.append(p[1]/200)
                    points.append(p[2])
                    #points.append(y)
                    blank_image = cv2.circle(blank_image, (math.floor(points[-3]),math.floor(points[-2])), radius=4, color=(0, 0, 255), thickness=-1)
                fingers = [[0, 1, 2, 3, 4],
                    [0, 5, 6, 7, 8],
                    [0, 9, 10, 11, 12],
                    [0, 13, 14, 15, 16],
                    [0, 17, 18, 19, 20]]
                for finger in fingers:
                    for k in range(len(finger)-1):
                        #print(k,k+1)
                        #print(finger[k],finger[k+1])
                        #print(data['landmarks'][finger[k]])
                        cv2.line(blank_image,(math.floor(data['landmarks'][finger[k]][0]),math.floor(data['landmarks'][finger[k]][1])),(math.floor(data['landmarks'][finger[k+1]][0]),math.floor(data['landmarks'][finger[k+1]][1])),(255,0,0),5)
                #print(data['landmarks'])
                    
                cv2.imshow('MediaPipe Hands', blank_image)
                if cv2.waitKey(5) & 0xFF == 27:
                    break
                inputPoints = pd.DataFrame([points],columns=['WRIST.x', 'WRIST.y', 'WRIST.z', 'THUMB_CMC.x', 'THUMB_CMC.y', 'THUMB_CMC.z', 'THUMB_MCP.x', 'THUMB_MCP.y', 'THUMB_MCP.z', 'THUMB_IP.x', 'THUMB_IP.y', 'THUMB_IP.z', 'THUMB_TIP.x', 'THUMB_TIP.y', 'THUMB_TIP.z', 'INDEX_FINGER_MCP.x', 'INDEX_FINGER_MCP.y', 'INDEX_FINGER_MCP.z', 'INDEX_FINGER_PIP.x', 'INDEX_FINGER_PIP.y', 'INDEX_FINGER_PIP.z', 'INDEX_FINGER_DIP.x', 'INDEX_FINGER_DIP.y', 'INDEX_FINGER_DIP.z', 'INDEX_FINGER_TIP.x', 'INDEX_FINGER_TIP.y', 'INDEX_FINGER_TIP.z', 'MIDDLE_FINGER_MCP.x', 'MIDDLE_FINGER_MCP.y', 'MIDDLE_FINGER_MCP.z', 'MIDDLE_FINGER_PIP.x', 'MIDDLE_FINGER_PIP.y', 'MIDDLE_FINGER_PIP.z', 'MIDDLE_FINGER_DIP.x', 'MIDDLE_FINGER_DIP.y', 'MIDDLE_FINGER_DIP.z', 'MIDDLE_FINGER_TIP.x', 'MIDDLE_FINGER_TIP.y', 'MIDDLE_FINGER_TIP.z', 'RING_FINGER_MCP.x', 'RING_FINGER_MCP.y', 'RING_FINGER_MCP.z', 'RING_FINGER_PIP.x', 'RING_FINGER_PIP.y', 'RING_FINGER_PIP.z', 'RING_FINGER_DIP.x', 'RING_FINGER_DIP.y', 'RING_FINGER_DIP.z', 'RING_FINGER_TIP.x', 'RING_FINGER_TIP.y', 'RING_FINGER_TIP.z', 'PINKY_MCP.x', 'PINKY_MCP.y', 'PINKY_MCP.z', 'PINKY_PIP.x', 'PINKY_PIP.y', 'PINKY_PIP.z', 'PINKY_DIP.x', 'PINKY_DIP.y', 'PINKY_DIP.z', 'PINKY_TIPPINKY_TIP.x', 'PINKY_TIPPINKY_TIP.y', 'PINKY_TIPPINKY_TIP.z'])
                pred,pred_idx,probs = learn_inf.predict(inputPoints.iloc[0])
                print(vocab[pred_idx])
                for client in clients:
                    #if client != websocket:
                    await client.send(vocab[pred_idx])
    finally:
        # Unregister.
        clients.remove(websocket)
    

start_server = websockets.serve(server, "192.168.0.118", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()