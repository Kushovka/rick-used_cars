"""mark 2019 Tesla Model X Performance as sold

Revision ID: 20261021_0014
Revises: 20261009_0013
Create Date: 2026-10-21
"""

from alembic import op
import sqlalchemy as sa


revision = "20261021_0014"
down_revision = "20261009_0013"
branch_labels = None
depends_on = None


VEHICLE_ID = "2019-tesla-model-x-performance"


def upgrade() -> None:
    connection = op.get_bind()
    result = connection.execute(
        sa.text(
            "UPDATE vehicles SET status = :status, featured = FALSE "
            "WHERE id = :vehicle_id AND status = :current_status"
        ),
        {"status": "Sold", "vehicle_id": VEHICLE_ID, "current_status": "Available"},
    )
    if result.rowcount != 1:
        raise RuntimeError(
            f"Expected exactly one available vehicle {VEHICLE_ID}; updated {result.rowcount} rows"
        )


def downgrade() -> None:
    op.execute(
        sa.text(
            "UPDATE vehicles SET status = 'Available', featured = TRUE "
            "WHERE id = :vehicle_id AND status = 'Sold'"
        ).bindparams(vehicle_id=VEHICLE_ID)
    )
