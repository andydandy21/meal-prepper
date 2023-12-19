import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export async function deleteIngredient(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (event.pathParameters && "id" in event.pathParameters) {
    const ingredientId = <string>event.pathParameters["id"];
    const deleteResponse = await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          pk: { S: "#IngredientList#" },
          sk: { S: `ingredient#${ingredientId}` },
        },
        ReturnValues: "ALL_OLD",
      }),
    );

    if (deleteResponse.Attributes) {
      return {
        statusCode: 200,
        body: JSON.stringify(`Deleted ingredient with id ${ingredientId}`),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify(`No ingredient found for id ${ingredientId}`),
      };
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Error: id required"),
  };
}
