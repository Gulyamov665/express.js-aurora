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

  @Column({ type: "int", nullable: true })
  orders_chat_id!: string;

  @Column({ type: "jsonb", nullable: true })
  restaurant!: {
    id: number;
    name: string;
    photo: string;
    address: string;
    phone: string;
  };

  @Column({ type: "varchar", default: "new" })
  status!: string;
}
