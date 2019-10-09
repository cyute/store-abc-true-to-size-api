import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './Product';
import { IsNumber, Min, Max } from 'class-validator';

@Entity()
export class Review {

  constructor(trueToSize: number) {
    this.trueToSize = trueToSize;
  }

  @PrimaryColumn()
  id: string;

  @ManyToOne(type => Product, product => product.reviews)
  product: Product;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(5)
  trueToSize: number;
}
