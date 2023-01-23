import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.author)
  readonly tasks?: Task[];

  constructor(name: string) {
    this.name = name;
  }
}
