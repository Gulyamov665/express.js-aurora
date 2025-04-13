import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity("orders")
export class Orders extends BaseModel {
  @Column({ type: "jsonb" })
  products!: {
    id: number;
    price: number;
    name: string;
    photo: string;
    quantity: number;
  }[];

  @Column({ type: "decimal" })
  total_price!: number;

  @Column({ type: "varchar" })
  lat!: string;

  @Column({ type: "varchar" })
  long!: string;

  @Column({ type: "int" })
  user_id!: number;

  @Column({ type: "int" })
  restaurant!: number;

  @Column({ type: "varchar", default: "pending" })
  status!: string;
}
