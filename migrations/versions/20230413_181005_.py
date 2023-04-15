"""empty message

Revision ID: 668270bf72aa
Revises: 84273c0b2002
Create Date: 2023-04-13 18:10:05.259723

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '668270bf72aa'
down_revision = '84273c0b2002'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('stripe_payment_id', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('has_payment_info', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('has_payment_info')
        batch_op.drop_column('stripe_payment_id')

    # ### end Alembic commands ###