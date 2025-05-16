from sqlalchemy import Column, Text, String, TIMESTAMP, ForeignKey, ARRAY 
from sqlalchemy.dialects.postgresql import UUID 
from api.database import Base 
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

class AutoSuggest(Base):
    __tablename__ = 'auto_suggests'
    
    detection_id = Column(UUID(as_uuid=True), ForeignKey("detected_signs.detection_id", onupdate="CASCADE", ondelete="RESTRICT"), primary_key=True)
    suggested_text = Column(ARRAY(Text), nullable=True)
    accepted_text = Column(Text, nullable=True)
    accepted_at = Column(TIMESTAMP, nullable=True)
    
    
    detected_signs = relationship("DetectedSign", back_populates="auto_suggests")
    
    def __repr__(self):
        return f"<AutoSuggest(detection_id={self.detection_id})>"
    
    
class Quickfix(Base):
    __tablename__ = 'quickfixes'
    
    fix_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    detection_id = Column(UUID(as_uuid=True), ForeignKey("detected_signs.detection_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    
    misspelling_word = Column(Text, nullable=False)
    quickfix_suggests = Column(ARRAY(Text), nullable=True)
    chosen_suggest = Column(Text, nullable=True)
    
    # Relationship
    detected_sign = relationship("DetectedSign", back_populates="quickfixes")
    
    def __repr__(self):
        return f"<Quickfix(fix_id={self.fix_id}, misspelling_word={self.misspelling_word})>"