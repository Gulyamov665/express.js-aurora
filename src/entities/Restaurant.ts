import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("restaurants")
export class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  restaurant_id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  address!: string;

  @Column({ type: "varchar" })
  phone!: string;

  @Column({ type: "varchar" })
  photo!: string;

  @Column({ type: "jsonb", default: {} })
  location!: {
    lat: number;
    long: number;
  };
}
