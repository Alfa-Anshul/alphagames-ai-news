from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
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
    scheduler = start_scheduler()
    yield
    # Graceful shutdown
    try:
        if scheduler and scheduler.running:
            scheduler.shutdown(wait=False)
    except Exception:
        pass

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

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# Health check MUST be registered before the SPA catch-all
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "AlphaGames AI News"}

app.include_router(articles.router, prefix="/api/articles", tags=["articles"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(tags.router, prefix="/api/tags", tags=["tags"])
app.include_router(search.router, prefix="/api/search", tags=["search"])

frontend_dist = os.path.join(os.path.dirname(__file__), "..", "..", "frontend_dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        index_path = os.path.join(frontend_dist, "index.html")
        return FileResponse(index_path)
