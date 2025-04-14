import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

// entities/Orders.ts
@Entity()
export class Cart extends BaseModel {
  @Column()
  user_id!: number;

  @Column()
  restaurant!: number;

  @Column("jsonb")
  products!: any[];
}
