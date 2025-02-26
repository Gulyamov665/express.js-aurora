import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";

export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @CreateDateColumn({ type: "timestamp" })
  public created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updated_at!: Date;

  @Column({ type: "varchar", nullable: true })
  public created_by?: string;
}
