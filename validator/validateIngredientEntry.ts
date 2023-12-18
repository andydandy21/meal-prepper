import { Ingredient } from "../model/Ingredient";
import { MissingFieldError } from "./MissingFieldError";

export function validateIngredientEntry(arg: Ingredient) {
  if (arg.pk == undefined) {
    throw new MissingFieldError("pk");
  }
  if (arg.sk == undefined) {
    throw new MissingFieldError("sk");
  }
  if (arg.name == undefined) {
    throw new MissingFieldError("name");
  }
}
