import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsNumber()
  gvtId!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  productTagline!: string;

  @IsNotEmpty()
  @IsString()
  shortDescription!: string;

  @IsNotEmpty()
  @IsString()
  longDescription!: string;

  @IsOptional()
  @IsString()
  logoLocation?: string;

  @IsNotEmpty()
  @IsString()
  productUrl!: string;

  @IsNotEmpty()
  @IsString()
  voucherTypeName!: string;

  @IsNotEmpty()
  @IsString()
  orderUrl!: string;

  @IsNotEmpty()
  @IsString()
  productTitle!: string;
}