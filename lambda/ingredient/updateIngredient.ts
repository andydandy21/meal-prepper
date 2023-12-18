import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UpdateItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GenerateUpdateExpression } from "../../util/util";

export async function updateIngredient(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (event.pathParameters && "id" in event.pathParameters) {
    const parsedBody = JSON.parse(<string>event.body);
    const ingredientId = <string>event.pathParameters["id"];
    const expression = GenerateUpdateExpression(parsedBody);
    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          pk: { S: "#IngredientList#" },
          sk: { S: ingredientId },
        },
        ReturnValues: "ALL_NEW",
        ...expression,
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args."),
  };
}
