import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('account')
@Index('idx_account_parent_id', ['parentId'])
@Index('idx_account_code', ['code'])
@Index('idx_account_type', ['accountType'])
@Index('idx_account_is_active', ['isActive'])
export class AccountOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;

  @Column({ type: 'smallint' })
  level: number;

  @Column({ name: 'account_type', type: 'varchar', length: 20 })
  accountType: string;

  @Column({ type: 'varchar', length: 10 })
  nature: string;

  @Column({ name: 'is_detail', type: 'boolean', default: false })
  isDetail: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string | null;

  // Auto-referencia para la jerarquía
  @ManyToOne(() => AccountOrmEntity, (account) => account.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: AccountOrmEntity | null;

  @OneToMany(() => AccountOrmEntity, (account) => account.parent)
  children: AccountOrmEntity[];
}
