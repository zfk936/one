import os
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from typing import Dict, List

app = FastAPI()

# 挂载静态文件目录
app.mount("/", StaticFiles(directory=".", html=True), name="static")

# 存储连接的客户端
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.nicknames: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        if client_id in self.nicknames:
            nickname = self.nicknames[client_id]
            del self.nicknames[client_id]
            return nickname
        return None

    async def broadcast(self, message: dict):
        for connection in self.active_connections.values():
            await connection.send_json(message)

    def set_nickname(self, client_id: str, nickname: str):
        self.nicknames[client_id] = nickname

    def get_nickname(self, client_id: str) -> str:
        return self.nicknames.get(client_id, "未知用户")

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    client_id = id(websocket)
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            if data["type"] == "join":
                manager.set_nickname(client_id, data["nickname"])
                await manager.broadcast({
                    "type": "join",
                    "nickname": data["nickname"]
                })
            elif data["type"] == "leave":
                nickname = manager.disconnect(client_id)
                if nickname:
                    await manager.broadcast({
                        "type": "leave",
                        "nickname": nickname
                    })
                break
            elif data["type"] == "message":
                await manager.broadcast({
                    "type": "message",
                    "nickname": data["nickname"],
                    "content": data["content"]
                })
    except WebSocketDisconnect:
        nickname = manager.disconnect(client_id)
        if nickname:
            await manager.broadcast({
                "type": "leave",
                "nickname": nickname
            })
    except Exception as e:
        print(f"Error: {e}")
        nickname = manager.disconnect(client_id)
        if nickname:
            await manager.broadcast({
                "type": "leave",
                "nickname": nickname
            })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", os.environ.get("VERCEL_PORT", 8765)))
uvicorn.run(app, host="0.0.0.0", port=port)