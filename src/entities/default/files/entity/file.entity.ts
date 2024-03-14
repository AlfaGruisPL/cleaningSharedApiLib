import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FileTypeEnum {
  file,
  image,
}

@Entity({ name: 'files' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  size: string;

  @Column()
  fakeName: string;

  @Column({ nullable: true })
  path: string | null;

  @Column({ nullable: true })
  type: FileTypeEnum;

  @Column()
  typ: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
