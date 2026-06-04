
from .base import RFIDParser

class GenericRFIDParser(RFIDParser):
    def parse(self, payload):
        return {
            "tag_id": payload.get("epc"),
            "reader_id": payload.get("reader"),
            "detected_at": payload.get("timestamp")
        }
