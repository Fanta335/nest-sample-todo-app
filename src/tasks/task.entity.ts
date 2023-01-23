import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (author) => author.tasks, { nullable: false })
  author?: User;

  constructor(name: string) {
    this.name = name;
  }
}
