export enum OrderItemAction {
  Add = "add",
  Decrease = "decrease",
  Increase = "increase",
}

export interface ChangeOrderItemsParams {
  id: number;
  product_id: number;
  type: OrderItemAction;
  option_id?: number | null;
}
