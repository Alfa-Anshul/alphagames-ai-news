from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .app.db.database import get_db
from .app.models.tag import Tag
from .app.schemas.article import TagOut
from typing import List

router = APIRouter()

@router.get("/", response_model=List[TagOut])
async def list_tags(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tag))
    return result.scalars().all()
