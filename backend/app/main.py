from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from contextlib import asynccontextmanager

from .db.database import init_db
from .db.seed import seed_articles
from .api import articles, categories, tags, search
from .services.scheduler import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_articles()
    start_scheduler()
    yield

app = FastAPI(
    title="AlphaGames AI News API",
    description="GPU & AI News Blog API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(articles.router, prefix="/api/articles", tags=["articles"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(tags.router, prefix="/api/tags", tags=["tags"])
app.include_router(search.router, prefix="/api/search", tags=["search"])

frontend_dist = os.path.join(os.path.dirname(__file__), "..", "..", "frontend_dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse(os.path.join(frontend_dist, "index.html"))

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "AlphaGames AI News"}
