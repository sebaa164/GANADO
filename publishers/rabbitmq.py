
import json, pika

def publish(event):
    conn = pika.BlockingConnection(
        pika.ConnectionParameters("localhost")
    )
    ch = conn.channel()
    ch.queue_declare(queue="animal.detected")
    ch.basic_publish(
        exchange="",
        routing_key="animal.detected",
        body=json.dumps(event)
    )
    conn.close()
