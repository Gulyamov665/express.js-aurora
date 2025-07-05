import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Product } from "../services/cartTypes";

// entities/Orders.ts
@Entity()
export class Cart extends BaseModel {
  @Column()
  user_id!: number;

  @Column()
  restaurant!: number;

  @Column("jsonb")
  products!: Product[];

  @Column({ type: "float", nullable: true })
  distance?: number;
}
