import socketio

# Initialize Async Socket.io Server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.on('join')
async def on_join(sid, data):
    role = data.get('role', 'all')
    await sio.enter_room(sid, role)
    print(f"User {sid} joined room: {role}")

async def broadcast_alert(message, target_role="all"):
    """
    Broadcasts a real-time notification to clients.
    target_role can be 'all', 'student', or 'faculty'.
    """
    await sio.emit('notification', {
        'message': message,
        'timestamp': None, # current time handles on client or server
        'target': target_role
    }, room=target_role if target_role != 'all' else None)
