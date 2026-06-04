
from dataclasses import dataclass

@dataclass
class RFIDEvent:
    tag_id:str
    reader_id:str
    detected_at:str
