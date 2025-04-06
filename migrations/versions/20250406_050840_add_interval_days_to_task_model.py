"""Add interval_days to Task model

Revision ID: 609ba2c20359
Revises: 34de9f53b711
Create Date: 2025-04-06 05:08:40.691384

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '609ba2c20359'
down_revision = '34de9f53b711'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('interval_days', sa.Integer(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_column('interval_days')

    # ### end Alembic commands ###
