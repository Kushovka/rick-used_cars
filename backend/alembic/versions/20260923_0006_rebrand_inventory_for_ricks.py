"""Rebrand retained inventory for Rick's Used Cars.

Revision ID: 20260923_0006
Revises: 20260728_0005
Create Date: 2026-09-23
"""

from alembic import op
import sqlalchemy as sa


revision = "20260923_0006"
down_revision = "20260728_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    connection.execute(
        sa.text(
            "UPDATE vehicles "
            "SET stock_number = regexp_replace(stock_number, '^[A-Z]{2}', 'RUC'), "
            "location = 'Dallas, PA'"
        )
    )


def downgrade() -> None:
    """Brand data intentionally remains with Rick's Used Cars on downgrade."""
