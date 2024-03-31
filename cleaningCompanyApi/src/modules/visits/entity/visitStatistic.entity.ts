import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'visit_statistic' })
export class VisitStatisticEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  date?: Date;

  @Column({ type: 'int', nullable: true })
  visits?: number = 0;

  @Column({ type: 'int', nullable: true })
  sumTimeOnWebsite? = 0;

  @Column({ type: 'int', nullable: true })
  avgVisitTime?: number = 0;
}
