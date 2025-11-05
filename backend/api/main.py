from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.assignments import router as assignments_router
from .routers.students import router as students_router
from .routers.faculty import router as faculty_router
from .routers.courses import router as courses_router

app = FastAPI(
    title="AI-AGI Campus API",
    description="The central API for the AI-AGI Powered Educational Organization & Campus Control System.",
    version="0.1.0",
)

# CORS for local dev frontends
origins = [
    # Homepage
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    # Student app
    "http://127.0.0.1:5174",
    "http://localhost:5174",
    # Faculty app
    "http://127.0.0.1:5175",
    "http://localhost:5175",
    # Parent app
    "http://127.0.0.1:5176",
    "http://localhost:5176",
    # Admin app
    "http://127.0.0.1:5177",
    "http://localhost:5177",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """
    Root endpoint for the API.
    Provides a welcome message and basic information about the API.
    """
    return {"message": "Welcome to the AI-AGI Campus API!"}


@app.get("/health")
async def health_check():
    """
    Health check endpoint to confirm the API is running.
    """
    return {"status": "ok"}


# Routers
app.include_router(assignments_router)
app.include_router(students_router)
app.include_router(faculty_router)
app.include_router(courses_router)
