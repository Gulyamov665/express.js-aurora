import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";
import { UserLocationType } from "../controllers/orders/types";
import { DistanceResult } from "../api/types";

@Entity("orders")
export class Orders extends BaseModel {
  @Column({ type: "jsonb" })
  products!: {
    id: number;
    price: number;
    name: string;
    photo: string;
    quantity: number;
    options?: {
      id: number;
      name: string;
      price: number;
      is_active: boolean;
    };
  }[];

  @Column({ type: "decimal" })
  total_price!: number;

  @Column({ type: "varchar" })
  lat!: string;

  @Column({ type: "varchar" })
  long!: string;

  @Column({ type: "int" })
  user_id!: number;

  @Column({ type: "varchar", nullable: true })
  user_phone_number!: string;

  @Column({ type: "varchar", nullable: true })
  orders_chat_id!: string;

  @Column({ type: "jsonb", nullable: true })
  restaurant!: {
    id: number;
    name: string;
    photo: string;
    address: string;
    phone: string;
    lat: string;
    long: string;
  };

  @Column({ type: "jsonb", nullable: true })
  location!: UserLocationType;

  @Column({ type: "varchar", default: "new" })
  status!: string;

  @Column({ type: "jsonb", nullable: true })
  courier!: {
    id: number;
    username: string;
    phone_number: string;
    accepted_at: Date;
  };
  @Column({ type: "jsonb", nullable: true })
  destination!: DistanceResult;

  @Column({ type: "int", default: 3500, nullable: true })
  fee!: number;

  @Column({ type: "int", default: 0, nullable: true })
  delivery_price!: number;
}
