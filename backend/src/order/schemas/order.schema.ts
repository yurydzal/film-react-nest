import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Order {
  @Prop({ required: true })
  film: string;
  @Prop({ required: true })
  session: string;
  @Prop({ required: true })
  daytime: string;
  @Prop({ required: true })
  row: number;
  @Prop({ required: true })
  seat: number;
  @Prop({ required: true })
  price: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ film: 1, session: 1, row: 1, seat: 1 }, { unique: true });
