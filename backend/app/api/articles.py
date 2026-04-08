from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from typing import Optional, List
from .app.db.database import get_db
from .app.models.article import Article
from .app.schemas.article import ArticleOut, ArticleDetail

router = APIRouter()

@router.get("/", response_model=List[ArticleOut])
async def list_articles(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    featured: Optional[bool] = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    q = select(Article).options(
        selectinload(Article.category),
        selectinload(Article.tags)
    ).order_by(Article.published_at.desc())

    if category:
        from .app.models.category import Category
        q = q.join(Article.category).where(Category.slug == category)
    if featured is not None:
        q = q.where(Article.featured == featured)
    q = q.offset(skip).limit(limit)

    result = await db.execute(q)
    return result.scalars().all()

@router.get("/featured", response_model=List[ArticleOut])
async def get_featured(db: AsyncSession = Depends(get_db)):
    q = select(Article).options(
        selectinload(Article.category),
        selectinload(Article.tags)
    ).where(Article.featured == True).order_by(Article.published_at.desc()).limit(5)
    result = await db.execute(q)
    return result.scalars().all()

@router.get("/{slug}", response_model=ArticleDetail)
async def get_article(slug: str, db: AsyncSession = Depends(get_db)):
    q = select(Article).options(
        selectinload(Article.category),
        selectinload(Article.tags)
    ).where(Article.slug == slug)
    result = await db.execute(q)
    article = result.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.execute(update(Article).where(Article.id == article.id).values(views=Article.views + 1))
    await db.commit()
    return article
