from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from .app.db.database import Base

article_tags = Table(
    "article_tags",
    Base.metadata,
    Column("article_id", Integer, ForeignKey("articles.id")),
    Column("tag_id", Integer, ForeignKey("tags.id"))
)

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(1000))
    category_id = Column(Integer, ForeignKey("categories.id"))
    read_time = Column(Integer, default=5)
    featured = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    published_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="articles")
    tags = relationship("Tag", secondary=article_tags, back_populates="articles")
