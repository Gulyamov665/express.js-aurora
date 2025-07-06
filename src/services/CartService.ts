import { AppDataSource } from "../config/database/data-source";
import { Cart } from "../entities/Cart";
import { IAddOrUpdateCartType, Product } from "./cartTypes";

export class CartService {
  static CartRepo = AppDataSource.getRepository(Cart);

  static async getCartItems(user_id: string, restaurant_id: string, distance?: number) {
    const user = parseInt(user_id);
    const restaurant = parseInt(restaurant_id);
    const cart = await this.CartRepo.findOneBy({
      user_id: user,
      restaurant,
    });

    if (!cart) {
      return null;
    }
    if (distance) cart.distance = distance;

    return cart;
  }

  static async addOrUpdateCartProducts(args: IAddOrUpdateCartType): Promise<Cart> {
    const { distance, newProduct, restaurant_id, user_id } = args;
    let cart = await this.CartRepo.findOneBy({
      user_id,
      restaurant: restaurant_id,
    });

    if (!cart) {
      cart = this.CartRepo.create({
        user_id,
        restaurant: restaurant_id,
        products: [],
        distance: distance,
      });
    }

    const existingProduct = cart.products.find((product: Product) => {
      return (
        product.id === newProduct.id &&
        ((product.options && newProduct.options && product.options.id === newProduct.options.id) ||
          (!product.options && !newProduct.options))
      );
    });
    if (existingProduct?.options && newProduct.options) {
      // Если продукт с опциями уже существует, обновляем количество
      if (existingProduct.options.id === newProduct.options.id) {
        existingProduct.quantity += newProduct.quantity;
      } else {
        // Если опции разные, добавляем новый продукт
        cart.products.push(newProduct);
      }
    } else if (existingProduct) {
      existingProduct.quantity += newProduct.quantity;
    } else {
      cart.products.push(newProduct);
    }

    return await this.CartRepo.save(cart);
  }

  static async decreaseProductQuantity(
    user_id: number,
    restaurant_id: number,
    targetProduct: Product
  ): Promise<Cart | null> {
    const cart = await this.CartRepo.findOneBy({
      user_id,
      restaurant: restaurant_id,
    });

    if (!cart) {
      return null;
    }

    // Находим продукт в корзине по id и опциям
    const productIndex = cart.products.findIndex((product) => {
      return (
        product.id === targetProduct.id &&
        ((product.options && targetProduct.options && product.options.id === targetProduct.options.id) ||
          (!product.options && !targetProduct.options))
      );
    });

    if (productIndex === -1) {
      return null; // Продукт не найден
    }

    const existingProduct = cart.products[productIndex];

    // Уменьшаем количество
    existingProduct.quantity -= 1;

    if (existingProduct.quantity <= 0) {
      // Удаляем товар
      cart.products.splice(productIndex, 1);
    }

    // Если корзина пуста — можно удалить корзину (опционально)
    if (cart.products.length === 0) {
      await this.CartRepo.delete({ user_id, restaurant: restaurant_id });
      return null;
    }

    return await this.CartRepo.save(cart);
  }

  static async removeCartByUserAndRestaurant(criteria: {
    id?: number;
    user_id?: number;
    restaurant?: number;
  }): Promise<boolean> {
    try {
      let deleteCriteria;

      // Если указан id, удаляем по id
      if (criteria.id) {
        deleteCriteria = { id: criteria.id };
      }
      // Иначе удаляем по user_id и restaurant
      else if (criteria.user_id && criteria.restaurant) {
        deleteCriteria = { user_id: criteria.user_id, restaurant: criteria.restaurant };
      } else {
        throw new Error("Необходимо указать либо id, либо { user_id, restaurant }");
      }

      const result = await this.CartRepo.delete(deleteCriteria); // Возвращаем true, если корзина была удалена
      return result.affected !== 0;
    } catch (error) {
      console.error("Ошибка при удалении корзины:", error);
      throw new Error("Не удалось удалить корзину");
    }
  }
}
