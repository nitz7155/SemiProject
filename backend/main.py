from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from . import models, schemas, crud, database
from .routers import books


app = FastAPI()
app.include_router(books.router)

models.Base.metadata.create_all(bind=database.engine)
