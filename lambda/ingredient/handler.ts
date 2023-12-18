import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getIngredient } from "./getIngredient";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postIngredient } from "./postIngredient";
import { updateIngredient } from "./updateIngredient";
import { deleteIngredient } from "./deleteIngredient";

const ddbClient = new DynamoDBClient();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  try {
    switch (event.httpMethod) {
      case "GET":
        return await getIngredient(event, ddbClient);
      case "POST":
        return await postIngredient(event, ddbClient);
      case "PUT":
        return await updateIngredient(event, ddbClient);
      case "Delete":
        return await deleteIngredient(event, ddbClient);
      default:
        break;
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
  return {
    statusCode: 500,
    body: JSON.stringify("unknown error"),
  };
}
