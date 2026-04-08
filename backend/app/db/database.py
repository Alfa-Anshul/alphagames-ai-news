from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os

# Use /data for persistent storage so DB survives container restarts
_default_db = "sqlite+aiosqlite:////data/alphagames.db"
DATABASE_URL = os.getenv("DATABASE_URL", _default_db)

# Ensure /data dir exists for SQLite
if DATABASE_URL.startswith("sqlite"):
    import pathlib
    db_path = DATABASE_URL.replace("sqlite+aiosqlite:///", "")
    pathlib.Path(db_path).parent.mkdir(parents=True, exist_ok=True)

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def init_db():
    async with engine.begin() as conn:
        from ..models import article, category, tag
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
