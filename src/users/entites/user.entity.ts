import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryColumn('uuid')
  uuid: string;

  @Column({ length: 50, nullable: false })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 50, nullable: false })
  username: string;

  @Column({ length: 12 })
  mobile: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 150, nullable: false })
  password: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
