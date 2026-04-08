from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .app.db.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)

    articles = relationship("Article", back_populates="category")
