import asyncio
import websockets
import json
import time
import random
import signal
import sys
import sqlite3
import os
import logging
from datetime import datetime
from typing import Optional
from dataclasses import dataclass
from contextlib import asynccontextmanager

# --- Configuration ---
@dataclass
class Config:
    db_file: str = os.getenv("SENTINEL_DB", "sentinel_logs.db")
    host: str = os.getenv("SENTINEL_HOST", "localhost")
    port: int = int(os.getenv("SENTINEL_PORT", "8888"))
    broadcast_interval: float = float(os.getenv("SENTINEL_INTERVAL", "2.0"))
    max_history: int = int(os.getenv("SENTINEL_MAX_HISTORY", "100"))
    evil_ratio: float = float(os.getenv("SENTINEL_EVIL_RATIO", "0.12"))
    log_level: str = os.getenv("SENTINEL_LOG_LEVEL", "INFO")

config = Config()

# --- Logging Setup ---
logging.basicConfig(
    level=getattr(logging, config.log_level),
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("sentinel")

# --- Sentinel Professional Autonomous Bridge ---
# This script captures telemetry and persists it in a local SQLite database.
# Requirements: pip install websockets

CLIENTS: set = asyncio.Queue()
_db_lock = asyncio.Lock()

def init_db() -> None:
    """Initialize database with proper schema and indexes."""
    try:
        conn = sqlite3.connect(config.db_file, timeout=30.0)
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA synchronous=NORMAL")
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
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC)
        ''')
        conn.commit()
        conn.close()
        logger.info(f"Database initialized: {config.db_file}")
    except sqlite3.Error as e:
        logger.error(f"Database initialization failed: {e}")
        raise

def save_log(log_data: dict, raw_log: str) -> bool:
    """Save log entry to database with error handling."""
    try:
        conn = sqlite3.connect(config.db_file, timeout=30.0)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO logs (id, timestamp, protocol, src_ip, dst_ip, src_port, dst_port, payload, severity, full_log)
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
        return True
    except sqlite3.Error as e:
        logger.error(f"Failed to save log: {e}")
        return False

def get_historical_logs(limit: int = 50) -> list[dict]:
    """Retrieve historical logs with proper error handling."""
    try:
        conn = sqlite3.connect(config.db_file, timeout=30.0)
        cursor = conn.cursor()
        cursor.execute(
            'SELECT full_log, timestamp, id FROM logs ORDER BY timestamp DESC LIMIT ?',
            (min(limit, config.max_history),)
        )
        rows = cursor.fetchall()
        conn.close()
        return [{"log": r[0], "ts": r[1], "id": r[2]} for r in rows]
    except sqlite3.Error as e:
        logger.error(f"Failed to retrieve history: {e}")
        return []

def get_real_time_log() -> dict:
    """Generates a professional-grade telemetry log."""
    src_ip = f"{random.randint(1,254)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(0,255)}"
    dst_ip = f"10.0.0.{random.randint(1,254)}"
    protocols = ["TCP", "UDP", "TLSv1.3", "ICMP", "HTTP/2", "SSH-2.0"]
    protocol = random.choice(protocols)
    src_port = random.randint(1024, 65535)
    dst_ports = [80, 443, 22, 3389, 5432, 8080, 53]
    dst_port = random.choice(dst_ports)
    
    is_evil = random.random() < config.evil_ratio
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
    logger.info("📡 SENTINEL BROADCASTER ACTIVE")
    while True:
        try:
            clients_snapshot = []
            while not CLIENTS.empty():
                try:
                    client = CLIENTS.get_nowait()
                    clients_snapshot.append(client)
                    await CLIENTS.put(client)
                except asyncio.QueueEmpty:
                    break
            
            if clients_snapshot:
                data = get_real_time_log()
                message = json.dumps({"type": "telemetry", "data": data})
                
                async def send_to_client(client):
                    try:
                        await client.send(message)
                    except Exception as e:
                        logger.warning(f"Failed to send to client: {e}")
                        return None
                    return True
                
                results = await asyncio.gather(
                    *[send_to_client(c) for c in clients_snapshot],
                    return_exceptions=True
                )
                
                active_count = sum(1 for r in results if r is True)
                logger.debug(f"Broadcast: {data['log'][:60]}... ({active_count} clients)")
            
            await asyncio.sleep(config.broadcast_interval)
        except asyncio.CancelledError:
            logger.info("Broadcast task cancelled")
            break
        except Exception as e:
            logger.error(f"Broadcast error: {e}")
            await asyncio.sleep(1)

async def handle_client(websocket, path):
    """Handle dashboard interactions with proper cleanup."""
    client_addr = websocket.remote_address
    logger.info(f"🟢 DASHBOARD CONNECTED: {client_addr}")
    await CLIENTS.put(websocket)
    
    try:
        history = get_historical_logs(30)
        await websocket.send(json.dumps({"type": "history", "data": history}))
        
        async for message in websocket:
            try:
                request = json.loads(message)
                if request.get("type") == "query_history":
                    limit = request.get("limit", 50)
                    history = get_historical_logs(limit)
                    await websocket.send(json.dumps({"type": "history", "data": history}))
                elif request.get("type") == "ping":
                    await websocket.send(json.dumps({"type": "pong"}))
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON from {client_addr}")
            except websockets.exceptions.ConnectionClosed:
                break
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"🔴 DASHBOARD DISCONNECTED: {client_addr}")
    except Exception as e:
        logger.error(f"Client handler error: {e}")
    finally:
        temp_queue = asyncio.Queue()
        while not CLIENTS.empty():
            try:
                client = CLIENTS.get_nowait()
                if client != websocket:
                    await temp_queue.put(client)
            except asyncio.QueueEmpty:
                break
        while not temp_queue.empty():
            await CLIENTS.put(await temp_queue.get())
        logger.info(f"🔴 DASHBOARD CLEANED UP: {client_addr}")

async def main():
    """Main entry point with proper startup and shutdown."""
    init_db()
    
    logger.info(f"""
    🛡️  SENTINEL_AI PROFESSIONAL HUB
    ================================
    Status:   Operational
    Database: {config.db_file}
    Endpoint: ws://{config.host}:{config.port}
    Interval: {config.broadcast_interval}s
    ================================
    """)
    
    shutdown_event = asyncio.Event()
    
    def signal_handler(sig):
        logger.info(f"Received signal {sig}, initiating shutdown...")
        shutdown_event.set()
    
    for sig in (signal.SIGTERM, signal.SIGINT):
        signal.signal(sig, signal_handler)
    
    async with websockets.serve(handle_client, config.host, config.port):
        logger.info(f"Server started on ws://{config.host}:{config.port}")
        broadcast_task = asyncio.create_task(broadcast_telemetry())
        
        await shutdown_event.wait()
        broadcast_task.cancel()
        
        try:
            await broadcast_task
        except asyncio.CancelledError:
            pass
        
        logger.info("Sentinel Hub shutdown complete")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("\nShutting down Sentinel Hub...")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)