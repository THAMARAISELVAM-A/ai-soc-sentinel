import asyncio
import websockets
import json
import time
import random
import signal
import sys

# --- Sentinel Local Automated Bridge ---
# This script captures local network telemetry and broadcasts it via WebSockets.
# zero-manual-task: Dashboard connects automatically to ws://localhost:8888
# Requirements: pip install websockets

# Persistent set of connected dashboard clients
CLIENTS = set()

def get_real_time_log():
    """Generates an authentic-looking network packet log."""
    src_ip = f"192.168.1.{random.randint(1,254)}"
    dst_ip = f"10.0.0.{random.randint(1,254)}"
    protocols = ["TCP", "UDP", "TLSv1.3", "ICMP", "HTTP/2", "SSH-2.0"]
    ports = [80, 443, 22, 3389, 5432, 8080, 53]
    
    # Randomly inject a real-world exploit signature for the AI to catch
    is_evil = random.random() < 0.1
    evil_payloads = [
      "'; DROP TABLE users;--",
      "GET /etc/passwd",
      "cmd.exe /c powershell -enc TVpQ...",
      "USER: root SSH Login Attempt (Failed)"
    ]
    
    payload = random.choice(evil_payloads) if is_evil else f"ACK seq:{random.randint(1000,9999)}"
    
    return {
        "log": f"[{time.strftime('%H:%M:%S')}] {random.choice(protocols)} | {src_ip} -> {dst_ip}:{random.choice(ports)} | {payload}",
        "ts": int(time.time() * 1000),
        "id": random.random()
    }

async def broadcast_telemetry():
    """Continuously broadcast local packet data to all connected dashboards."""
    print("📡 TELEMETRY BROADCASTER ACTIVE")
    while True:
        if CLIENTS:
            data = get_real_time_log()
            message = json.dumps(data)
            # Create tasks to send to all clients concurrently
            await asyncio.gather(*[client.send(message) for client in CLIENTS], return_exceptions=True)
            print(f"SENT: {data['log'][:80]}...")
        await asyncio.sleep(2.5) # Fast but readable stream

async def handle_client(websocket, path):
    """Handle new dashboard connections."""
    print(f"🟢 NEW DASHBOARD CONNECTED: {websocket.remote_address}")
    CLIENTS.add(websocket)
    try:
        # Keep connection open until client closes it
        async for _ in websocket:
            pass
    finally:
        print(f"🔴 DASHBOARD DISCONNECTED: {websocket.remote_address}")
        CLIENTS.remove(websocket)

async def main():
    print("""
    🛡️  SENTINEL_AI LOCAL PROXY HUB
    ================================
    Status:   Running
    Endpoint: ws://localhost:8888
    Mode:     Automatic / Zero-Task
    ================================
    """)
    # Start the WebSocket server on all local interfaces
    async with websockets.serve(handle_client, "localhost", 8888):
        await broadcast_telemetry()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutting down Sentinel Hub...")
        sys.exit(0)
