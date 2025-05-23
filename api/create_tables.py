import sys 
import os 

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, engine




print("Creating all tables if not exist...")
Base.metadata.create_all(bind=engine)
print("Done.")