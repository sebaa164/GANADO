
import json
import paho.mqtt.client as mqtt
from app.parsers.generic import GenericRFIDParser
from app.publishers.rabbitmq import publish

parser = GenericRFIDParser()

def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    parsed = parser.parse(data)
    publish(parsed)

def start():
    client = mqtt.Client()
    client.on_message = on_message
    client.connect("localhost",1883,60)
    client.subscribe("rfid/+/events")
    client.loop_forever()
