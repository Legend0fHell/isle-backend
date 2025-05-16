from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey, ARRAY 
from sqlalchemy.dialects.postgresql import UUID 
from api.database import Base
from sqlalchemy.orm import relationship 
from datetime import datetime
import uuid 

class DetectedSign(Base):
    __tablename__ = 'detected_signs'
    
    detection_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4())
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    
    detected_character = Column(String, nullable=False)
    current_user_text = Column(Text, nullable=False)
    
    image_data = Column(ARRAY(Text))
    created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    
    # Relationship 
    user = relationship("User", back_populates="detected_signs")
    auto_suggests = relationship("AutoSuggest", back_populates="detected_signs", cascade="all, delete-orphan")
    quickfixes = relationship("Quickfix", back_populates="detected_sign", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<DetectedSign(detection_id={self.detection_id}, detected_character={self.detected_character})>"
    