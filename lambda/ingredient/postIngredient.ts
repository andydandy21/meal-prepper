import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 } from "uuid";
import { validateIngredientEntry } from "../../validator/validateIngredientEntry";
import { Ingredient } from "../../model/Ingredient";

export async function postIngredient(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const pk = "#IngredientList#";
  const item: Ingredient = JSON.parse(<string>event.body);
  item.sk = randomId;
  item.pk = pk;
  validateIngredientEntry(item);

  await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item),
    }),
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "OK", item: item }),
  };
}
