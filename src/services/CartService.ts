import { AppDataSource } from "../config/database/data-source";
import { Cart } from "../entities/Cart";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export class CartService {
  static CartRepo = AppDataSource.getRepository(Cart);

  static async getCartItems(user_id: string, restaurant_id: string) {
    const user = parseInt(user_id);
    const restaurant = parseInt(restaurant_id);
    const cart = await this.CartRepo.findOneBy({
      user_id: user,
      restaurant,
    });

    if (!cart) {
      return null;
    }

    return cart;
  }

  static async addOrUpdateCartProducts(user_id: number, restaurant_id: number, newProduct: Product): Promise<Cart> {
    let cart = await this.CartRepo.findOneBy({
      user_id,
      restaurant: restaurant_id,
    });

    if (!cart) {
      cart = this.CartRepo.create({
        user_id,
        restaurant: restaurant_id,
        products: [],
      });
    }

    const existingProduct = cart.products.find((product: Product) => product.id === newProduct.id);

    if (existingProduct) {
      existingProduct.quantity += newProduct.quantity;
    } else {
      cart.products.push(newProduct);
    }

    return await this.CartRepo.save(cart);
  }

  static async decreaseProductQuantity(
    user_id: number,
    restaurant_id: number,
    product_id: number
  ): Promise<Cart | null> {
    // Находим корзину
    const cart = await this.CartRepo.findOneBy({
      user_id,
      restaurant: restaurant_id,
    });

    if (!cart) {
      return null; // Корзина не найдена
    }

    // Находим продукт в корзине
    const product = cart.products.find((product: any) => product.id === product_id);

    if (!product) {
      return null; // Продукт не найден
    }

    // Уменьшаем количество
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else if (product.quantity === 1) {
      // Если количество равно переданному, удаляем продукт
      cart.products = cart.products.filter((p: any) => p.id !== product_id);
    } else {
      return null; // Попытка уменьшить количество больше, чем есть в корзине
    }

    // Сохраняем изменения в корзине
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
