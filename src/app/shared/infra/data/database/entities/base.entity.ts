import { BeforeInsert, BeforeUpdate, Column, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

export abstract class EntityBase {
  @PrimaryColumn()
  public uid!: string;

  @Column({ name: 'created_at' })
  public createdAt!: Date;

  @Column({ name: 'updated_at' })
  public updatedAt!: Date;

  @BeforeInsert()
  public beforeInsert(): void {
    this.uid = uuid();
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
  }

  @BeforeUpdate()
  public beforeUpdate(): void {
    this.updatedAt = new Date(Date.now());
  }
}
