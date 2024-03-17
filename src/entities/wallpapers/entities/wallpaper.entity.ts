import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'wallpapers' })
export class Wallpaper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string | null;

  @Column()
  price: number;
  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
