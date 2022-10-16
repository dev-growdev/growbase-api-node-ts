import { randomUUID } from 'crypto';
import { BeforeInsert, BeforeUpdate, Column, PrimaryColumn } from 'typeorm';

export abstract class EntityBase {
  @PrimaryColumn()
  public uid!: string;

  @Column({ name: 'created_at' })
  public createdAt!: Date;

  @Column({ name: 'updated_at' })
  public updatedAt!: Date;

  @BeforeInsert()
  public beforeInsert(): void {
    this.uid = randomUUID();
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
  }

  /* istanbul ignore next */
  @BeforeUpdate()
  public beforeUpdate(): void {
    this.updatedAt = new Date(Date.now());
  }
}
