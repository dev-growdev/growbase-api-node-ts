import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { EntityBase, RoleEntity, UserEntity } from '.';

@Entity({ name: 'users_roles' })
export class UserRoleEntity extends EntityBase {
  @Column({ name: 'user_uid' })
  userUid!: string;

  @Column({ name: 'role_uid' })
  roleUid!: string;

  @Column()
  actions!: string;

  @OneToOne(() => UserEntity, (entity) => entity.userRole)
  @JoinColumn({ name: 'user_uid', referencedColumnName: 'uid' })
  user?: UserEntity;

  @ManyToOne(() => RoleEntity, (entity) => entity.userRoles)
  @JoinColumn({ name: 'role_uid', referencedColumnName: 'uid' })
  role?: RoleEntity;
}
