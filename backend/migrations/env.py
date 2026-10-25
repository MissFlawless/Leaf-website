from logging.config import fileConfig
from flask import current_app
from alembic import context
from app.extensions import db
from app import models  # noqa

config = context.config
try:
    fileConfig(config.config_file_name) if config.config_file_name else None
except KeyError:
    pass
target_metadata = db.metadata


def get_url():
    return current_app.config["SQLALCHEMY_DATABASE_URI"]


def run_migrations_offline():
    context.configure(url=get_url(), target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    with db.engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
