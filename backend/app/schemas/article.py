from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class TagOut(BaseModel):
    id: int
    name: str
    slug: str
    model_config = {"from_attributes": True}

class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    model_config = {"from_attributes": True}

class ArticleOut(BaseModel):
    id: int
    title: str
    slug: str
    summary: str
    image_url: Optional[str]
    category: Optional[CategoryOut]
    tags: List[TagOut] = []
    read_time: int
    featured: bool
    views: int
    published_at: datetime
    model_config = {"from_attributes": True}

class ArticleDetail(ArticleOut):
    content: str
