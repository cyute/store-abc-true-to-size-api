import { Entity, Column, PrimaryColumn, OneToMany, AfterLoad } from 'typeorm';
import { Review } from './Review';
import { IsString, MaxLength } from 'class-validator';

@Entity()
export class Product {

  constructor(name: string) {
    this.name = name;
  }

  @PrimaryColumn()
  id: string;

  @Column()
  @IsString()
  @MaxLength(200)
  name: string;

  @OneToMany(type => Review, review => review.product, { eager: true })
  reviews: Review[];

  trueToSizeCalculation: number;

  @AfterLoad()
  calculateTrueToSize() {
    if (this.reviews && this.reviews.length > 0) {
      const sumOfTrueSizes: number = this.reviews.reduce((accumulator: number, review: Review) => accumulator + review.trueToSize, 0);
      this.trueToSizeCalculation = sumOfTrueSizes / this.reviews.length;
    }
  }
}
