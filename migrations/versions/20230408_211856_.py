"""empty message

Revision ID: 84273c0b2002
Revises: 564773132c3b
Create Date: 2023-04-08 21:18:56.766308

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '84273c0b2002'
down_revision = '564773132c3b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('check_ins', schema=None) as batch_op:
        batch_op.add_column(sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('check_ins', schema=None) as batch_op:
        batch_op.drop_column('amount')

    # ### end Alembic commands ###