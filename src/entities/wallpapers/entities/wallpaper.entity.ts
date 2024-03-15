import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Wallpaper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string | null;

  @Column()
  price: number;
  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
