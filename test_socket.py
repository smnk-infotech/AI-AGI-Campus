import asyncio
import socketio

async def test_broadcast():
    sio = socketio.AsyncClient()
    
    @sio.on('notification')
    def on_notification(data):
        print(f"RECEIVED NOTIFICATION: {data}")

    await sio.connect('http://localhost:8001')
    print("Connected to server")
    
    await sio.emit('join', {'role': 'student'})
    print("Joined student room")
    
    # Wait for a bit to receive something if broadcast is happening
    await asyncio.sleep(10)
    await sio.disconnect()

if __name__ == "__main__":
    # This requires the server to be running on 8001
    try:
        asyncio.run(test_broadcast())
    except Exception as e:
        print(f"Test failed: {e}. Is the server running?")
