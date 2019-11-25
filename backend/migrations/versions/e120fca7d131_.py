"""empty message

Revision ID: e120fca7d131
Revises: 43925bfa7137
Create Date: 2019-11-24 19:27:38.144508

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e120fca7d131'
down_revision = '43925bfa7137'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('game',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('started_at', sa.DateTime(), nullable=False),
    sa.Column('finished_at', sa.DateTime(), nullable=True),
    sa.Column('winner', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('event', sa.Column('game_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'event', 'game', ['game_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'event', type_='foreignkey')
    op.drop_column('event', 'game_id')
    op.drop_table('game')
    # ### end Alembic commands ###