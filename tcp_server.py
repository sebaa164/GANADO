
import socket, json
from app.parsers.generic import GenericRFIDParser
from app.publishers.rabbitmq import publish

def start():
    parser = GenericRFIDParser()
    server = socket.socket()
    server.bind(("0.0.0.0",5000))
    server.listen()

    while True:
        conn,_ = server.accept()
        data = json.loads(conn.recv(4096).decode())
        publish(parser.parse(data))
