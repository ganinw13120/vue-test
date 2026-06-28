import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
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
  @IsUrl()
  productUrl!: string;

  @IsNotEmpty()
  @IsString()
  voucherTypeName!: string;

  @IsNotEmpty()
  @IsUrl()
  orderUrl!: string;

  @IsNotEmpty()
  @IsString()
  productTitle!: string;

  @IsOptional()
  @IsString()
  variableDenomPriceMinAmount?: string;

  @IsOptional()
  @IsString()
  variableDenomPriceMaxAmount?: string;
}