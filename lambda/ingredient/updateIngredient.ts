import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UpdateItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { generateUpdateExpression } from "../../util/util";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function updateIngredient(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (event.pathParameters && "id" in event.pathParameters) {
    const parsedBody = JSON.parse(<string>event.body);
    const ingredientId = <string>event.pathParameters["id"];
    const expression = generateUpdateExpression(parsedBody);
    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          pk: { S: "#IngredientList#" },
          sk: { S: `ingredient#${ingredientId}` },
        },
        ReturnValues: "ALL_NEW",
        ...expression,
      }),
    );

    if (updateResult.Attributes) {
      return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(updateResult.Attributes)),
      };
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args."),
  };
}
