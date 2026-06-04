
import random, time, json
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("localhost",1883,60)

while True:
    event = {
        "epc": str(random.randint(100000,999999)),
        "reader":"SIMULATOR",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    client.publish("rfid/dev/events", json.dumps(event))
    time.sleep(1)
