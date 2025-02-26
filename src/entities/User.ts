import { Entity, Column } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity("users")
export class User extends BaseModel {
  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;
}
