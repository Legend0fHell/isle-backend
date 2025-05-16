from api.models.detected_sign import DetectedSign
from api.schemas.auto_suggest import AutoSuggestCreate
from api.schemas.quickfix import QuickfixCreate

def generate_auto_suggest(detection: DetectedSign) -> AutoSuggestCreate:
    # Place holder logic
    suggested_texts = [""]
    return AutoSuggestCreate(
        detection_id=detection.detection_id,
        suggested_text=suggested_texts,

    )

"""
# Schema for new Quickfix
class QuickfixCreate(BaseModel):
    detection_id: UUID
    misspelling_word: str
    quickfix_suggests: Optional[List[str]] = None
"""
def generate_quickfix(detection: DetectedSign) -> QuickfixCreate:
    # Place holder logic
    misspelling_word = ""
    quickfix_suggests = [""]
    
    return QuickfixCreate(
        detection_id=detection.detection_id,
        misspelling_word=misspelling_word,
        quickfix_suggests=quickfix_suggests
    )

