import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Product } from "../services/cartTypes";
import { DeliveryRule, DistanceResult } from "../api/types";

export type DeliverySnapshot = Pick<DeliveryRule, "calculation_type" | "price_per_km" | "price_per_percent">;

// entities/Orders.ts
@Entity()
export class Cart extends BaseModel {
  @Column()
  user_id!: number;

  @Column()
  restaurant!: number;

  @Column("jsonb")
  products!: Product[];

  @Column({ type: "jsonb", nullable: true })
  destination!: DistanceResult;

  @Column({ type: "jsonb", nullable: true })
  delivery!: DeliverySnapshot;
}
