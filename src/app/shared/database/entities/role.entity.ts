import { Column, Entity, OneToMany } from 'typeorm';
import { EntityBase, UserRoleEntity } from '.';

@Entity({ name: 'roles' })
export class RoleEntity extends EntityBase {
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  type!: number;

  @Column()
  enable!: boolean;

  @OneToMany(() => UserRoleEntity, (entity) => entity.role)
  userRoles?: UserRoleEntity[];
}
