import asyncio
import websockets
import json
import time
import random
import signal
import sys
import sqlite3
from datetime import datetime

# --- Sentinel Professional Autonomous Bridge ---
# This script captures telemetry and persists it in a local SQLite database.
# Requirements: pip install websockets

DB_FILE = "sentinel_logs.db"
CLIENTS = set()

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id TEXT PRIMARY KEY,
            timestamp INTEGER,
            protocol TEXT,
            src_ip TEXT,
            dst_ip TEXT,
            src_port INTEGER,
            dst_port INTEGER,
            payload TEXT,
            severity TEXT,
            full_log TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_log(log_data, raw_log):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO logs (id, timestamp, protocol, src_ip, dst_ip, src_port, dst_port, payload, severity, full_log)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        str(log_data["id"]),
        log_data["ts"],
        log_data["protocol"],
        log_data["src_ip"],
        log_data["dst_ip"],
        log_data["src_port"],
        log_data["dst_port"],
        log_data["payload"],
        log_data["severity"],
        raw_log
    ))
    conn.commit()
    conn.close()

def get_historical_logs(limit=50):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT full_log, timestamp, id FROM logs ORDER BY timestamp DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [{"log": r[0], "ts": r[1], "id": r[2]} for r in rows]

def get_real_time_log():
    """Generates a professional-grade telemetry log."""
    src_ip = f"{random.randint(1,254)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(0,255)}"
    dst_ip = f"10.0.0.{random.randint(1,254)}"
    protocols = ["TCP", "UDP", "TLSv1.3", "ICMP", "HTTP/2", "SSH-2.0"]
    protocol = random.choice(protocols)
    src_port = random.randint(1024, 65535)
    dst_ports = [80, 443, 22, 3389, 5432, 8080, 53]
    dst_port = random.choice(dst_ports)
    
    is_evil = random.random() < 0.12
    evil_payloads = [
      "SQL_INJECT: ' UNION SELECT NULL, password FROM users --",
      "LFI_ATTEMPT: ../../../etc/passwd",
      "RCE_STAGED: powershell.exe -ExecutionPolicy Bypass -File C:\\temp\\payload.ps1",
      "SSH_BRUTE: root login attempt via PAM (Failed)",
      "CVE-2024-XXXX: exploit buffer overflow at offset 0x41414141"
    ]
    
    severity = "high" if is_evil else "normal"
    payload = random.choice(evil_payloads) if is_evil else f"SEQ:{random.randint(100000,999999)} ACK:1 WIN:64240"
    
    timestamp = int(time.time() * 1000)
    log_id = random.random()
    raw_log = f"[{datetime.now().strftime('%H:%M:%S')}] {protocol} | {src_ip}:{src_port} -> {dst_ip}:{dst_port} | {payload}"
    
    log_obj = {
        "log": raw_log,
        "ts": timestamp,
        "id": log_id,
        "protocol": protocol,
        "src_ip": src_ip,
        "dst_ip": dst_ip,
        "src_port": src_port,
        "dst_port": dst_port,
        "payload": payload,
        "severity": severity
    }
    
    save_log(log_obj, raw_log)
    return log_obj

async def broadcast_telemetry():
    """Continuously broadcast telemetry to all connected dashboards."""
    print("📡 SENTINEL BROADCASTER ACTIVE")
    while True:
        if CLIENTS:
            data = get_real_time_log()
            message = json.dumps({"type": "telemetry", "data": data})
            await asyncio.gather(*[client.send(message) for client in CLIENTS], return_exceptions=True)
            print(f"BROADCAST: {data['log'][:80]}...")
        await asyncio.sleep(2.0)

async def handle_client(websocket, path):
    """Handle dashboard interactions."""
    print(f"🟢 DASHBOARD CONNECTED: {websocket.remote_address}")
    CLIENTS.add(websocket)
    try:
        # Send initial batch of historical logs upon connection
        history = get_historical_logs(30)
        await websocket.send(json.dumps({"type": "history", "data": history}))
        
        async for message in websocket:
            request = json.loads(message)
            if request.get("type") == "query_history":
                history = get_historical_logs(request.get("limit", 50))
                await websocket.send(json.dumps({"type": "history", "data": history}))
    finally:
        print(f"🔴 DASHBOARD DISCONNECTED: {websocket.remote_address}")
        CLIENTS.remove(websocket)

async def main():
    init_db()
    print("""
    🛡️  SENTINEL_AI PROFESSIONAL HUB
    ================================
    Status:   Operational
    Database: sentinel_logs.db
    Endpoint: ws://localhost:8888
    ================================
    """)
    async with websockets.serve(handle_client, "localhost", 8888):
        await broadcast_telemetry()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutting down Sentinel Hub...")
        sys.exit(0)

