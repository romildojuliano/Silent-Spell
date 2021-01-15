import asyncio
import websockets
import json
import os
import cv2

from fastai.tabular.all import *
import math

path = Path()
path.ls(file_exts='.pkl')
learn_inf = load_learner(path/'modeloTabularNovo3.pkl')
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
    try:
        async for message in websocket:
            #print("that was the message")
            if len(message) > 2:
                message = message[1:-1]
                data = json.loads(message)
                #print(json.dumps(data,indent=4))
                points = []
                blank_image = np.zeros((200,200,3), np.uint8)

                for p in data['landmarks']:
                    x = math.floor(p[0])
                    y = math.floor(p[1])
                    points.append(x)
                    points.append(y)
                    blank_image = cv2.circle(blank_image, (x,y), radius=4, color=(0, 0, 255), thickness=-1)
                #print(data['landmarks'])
                    
                cv2.imshow('MediaPipe Hands', blank_image)
                if cv2.waitKey(5) & 0xFF == 27:
                    break
                inputPoints = pd.DataFrame([points],columns=['WRIST.x', 'WRIST.y', 'THUMB_CMC.x', 'THUMB_CMC.y', 'THUMB_MCP.x', 'THUMB_MCP.y', 'THUMB_IP.x', 'THUMB_IP.y', 'THUMB_TIP.x', 'THUMB_TIP.y', 'INDEX_FINGER_MCP.x', 'INDEX_FINGER_MCP.y', 'INDEX_FINGER_PIP.x', 'INDEX_FINGER_PIP.y', 'INDEX_FINGER_DIP.x', 'INDEX_FINGER_DIP.y', 'INDEX_FINGER_TIP.x', 'INDEX_FINGER_TIP.y', 'MIDDLE_FINGER_MCP.x', 'MIDDLE_FINGER_MCP.y', 'MIDDLE_FINGER_PIP.x', 'MIDDLE_FINGER_PIP.y', 'MIDDLE_FINGER_DIP.x', 'MIDDLE_FINGER_DIP.y', 'MIDDLE_FINGER_TIP.x', 'MIDDLE_FINGER_TIP.y', 'RING_FINGER_MCP.x', 'RING_FINGER_MCP.y', 'RING_FINGER_PIP.x', 'RING_FINGER_PIP.y', 'RING_FINGER_DIP.x', 'RING_FINGER_DIP.y', 'RING_FINGER_TIP.x', 'RING_FINGER_TIP.y', 'PINKY_MCP.x', 'PINKY_MCP.y', 'PINKY_PIP.x', 'PINKY_PIP.y', 'PINKY_DIP.x', 'PINKY_DIP.y', 'PINKY_TIPPINKY_TIP.x', 'PINKY_TIPPINKY_TIP.y'])
                pred,pred_idx,probs = learn_inf.predict(inputPoints.iloc[0])
                print(vocab[pred_idx])
                #for client in clients:
                    # if client != websocket:
                #    await client.send(json.dumps(data))
    finally:
        # Unregister.
        clients.remove(websocket)
    

start_server = websockets.serve(server, "192.168.0.108", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()