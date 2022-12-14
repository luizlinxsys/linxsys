import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull
} from "sequelize-typescript";

@Table
class Company extends Model<Company> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @AllowNull(true)
  @Column
  billingName: string;

  @AllowNull(true)
  @Column
  documentNumber: string;

  @Default(0)
  @Column
  allowedUsers: number;

  @Default(0)
  @Column
  allowedWhats: number;

  @Default(0)
  @Column
  isTrial: number;

  @Default(0)
  @Column
  isDisabled: number;

  @Default(0)
  @Column
  isEmailVerified: number;

  @Default(0)
  @Column
  trialExpiration: number;

  @AllowNull(true)
  @Column
  email: string;

  @AllowNull(true)
  @Column
  addressStreet: string;

  @AllowNull(true)
  @Column
  addressNumber: string;

  @AllowNull(true)
  @Column
  addressComplement: string;

  @AllowNull(true)
  @Column
  addressDistrict: string;

  @AllowNull(true)
  @Column
  addressCity: string;

  @AllowNull(true)
  @Column
  addressState: string;

  @AllowNull(true)
  @Column
  addressZipCode: string;

  @Default(10)
  @Column
  messagesApiDailyLimit: number;

  @AllowNull(true)
  @Column
  language: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Company;
