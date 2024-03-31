import { Table, Column, Model, DataType } from "sequelize-typescript";
import { Role } from "../utils/enum";

@Table({ tableName: "users", timestamps: false })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.ENUM({ values: Object.keys(Role) }),
    allowNull: false,
  })
  role!: Role;

  @Column({
    type: DataType.INTEGER,
  })
  updated_at?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_at?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  telephone?: string;
}
