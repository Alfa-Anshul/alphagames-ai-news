from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from ..db.database import get_db
from ..models.article import Article
from ..schemas.article import ArticleOut
from typing import List

router = APIRouter()

@router.get("/", response_model=List[ArticleOut])
async def search_articles(q: str = Query(..., min_length=2), db: AsyncSession = Depends(get_db)):
    query = select(Article).options(
        selectinload(Article.category),
        selectinload(Article.tags)
    ).where(
        or_(
            Article.title.ilike(f"%{q}%"),
            Article.summary.ilike(f"%{q}%"),
            Article.content.ilike(f"%{q}%")
        )
    ).limit(10)
    result = await db.execute(query)
    return result.scalars().all()
