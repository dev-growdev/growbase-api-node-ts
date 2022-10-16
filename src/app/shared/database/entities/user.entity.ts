import { AppError } from '../../errors';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { EntityBase, ProfileDataEntity } from '.';

@Entity({ name: 'users' })
export class UserEntity extends EntityBase {
  @Column()
  login!: string;

  @Column()
  password!: string;

  @Column()
  enable!: boolean;

  @Column()
  verified!: boolean;

  @Column({ name: 'profile_uid' })
  profileUid!: string;

  @OneToOne(() => ProfileDataEntity)
  @JoinColumn({ name: 'profile_uid', referencedColumnName: 'uid' })
  profileEntity?: ProfileDataEntity;

  get profile(): ProfileDataEntity {
    if (!this.profileEntity) {
      throw new AppError('Dados do perfil não carregado na entidade');
    }
    return this.profileEntity as ProfileDataEntity;
  }
}
