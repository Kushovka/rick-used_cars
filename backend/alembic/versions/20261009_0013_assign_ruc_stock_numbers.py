"""Assign Rick's Used Cars stock numbers to current inventory.

Revision ID: 20261009_0013
Revises: 20261005_0012
Create Date: 2026-10-09
"""

from alembic import op
import sqlalchemy as sa


revision = "20261009_0013"
down_revision = "20261005_0012"
branch_labels = None
depends_on = None


STOCK_NUMBERS = {
    "2021-porsche-cayenne-turbo": "RUC16772",
    "2019-tesla-model-x-performance": "RUC60952",
    "2020-audi-s8": "RUC63758",
    "2023-chevrolet-silverado-1500-rst-black-widow": "RUC60141",
    "2021-ford-f-150-raptor-supercrew": "RUC40708",
    "2024-ram-1500-trx-final-edition": "RUC52044",
    "2024-chevrolet-corvette-stingray-3lt-z51": "RUC85057",
    "2022-gmc-sierra-1500-limited-harley-davidson": "RUC48587",
    "2021-toyota-land-cruiser-urj200-23k": "RUC77123",
    "2020-chevrolet-corvette-stingray-2lt": "RUC23800",
    "2023-cadillac-escalade-v": "RUC65188",
    "2025-toyota-land-cruiser-j250": "RUC50832",
    "2021-toyota-land-cruiser-urj200-22k": "RUC63309",
    "2024-chevrolet-corvette-z06-convertible-3lz": "RUC09145",
    "2019-mercedes-amg-g63": "RUC95920",
    "2024-gmc-sierra-2500hd-denali-ultimate": "RUC24490",
}


def upgrade() -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("slug", sa.String),
        sa.column("stock_number", sa.String),
    )
    connection = op.get_bind()

    for slug, stock_number in STOCK_NUMBERS.items():
        row = connection.execute(
            sa.select(vehicles.c.stock_number).where(vehicles.c.slug == slug)
        ).one_or_none()
        if row is None:
            raise RuntimeError(f"Vehicle {slug} was not found; refusing to continue")
        expected = f"RUC-{slug.upper()}"
        if row.stock_number != expected:
            raise RuntimeError(
                f"Unexpected stock number for {slug}; expected {expected}, "
                f"found {row.stock_number!r}; refusing to overwrite it"
            )

    for slug, stock_number in STOCK_NUMBERS.items():
        connection.execute(
            vehicles.update()
            .where(vehicles.c.slug == slug)
            .values(stock_number=stock_number)
        )


def downgrade() -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("slug", sa.String),
        sa.column("stock_number", sa.String),
    )
    connection = op.get_bind()

    for slug, stock_number in STOCK_NUMBERS.items():
        row = connection.execute(
            sa.select(vehicles.c.stock_number).where(vehicles.c.slug == slug)
        ).one_or_none()
        if row is None or row.stock_number != stock_number:
            raise RuntimeError(
                f"Unexpected stock number for {slug}; refusing to restore placeholder"
            )

    for slug in STOCK_NUMBERS:
        connection.execute(
            vehicles.update()
            .where(vehicles.c.slug == slug)
            .values(stock_number=f"RUC-{slug.upper()}")
        )
