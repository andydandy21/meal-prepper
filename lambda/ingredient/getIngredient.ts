import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  QueryCommand,
  GetItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getIngredient(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (event.pathParameters && "id" in event.pathParameters) {
    const id = <string>event.pathParameters["id"];
    const sk = `ingredient#${id}`;
    const getItemResponse = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          pk: { S: "#IngredientList#" },
          sk: { S: sk },
        },
      }),
    );
    if (getItemResponse.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(getItemResponse.Item)),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify(`Ingredient with id ${id} not found`),
      };
    }
  }

  if (!event.pathParameters) {
    const queryItemResponse = await ddbClient.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: `#pk = :v1`,
        ExpressionAttributeValues: {
          ":v1": { S: "#IngredientList#" },
        },
        ExpressionAttributeNames: {
          "#pk": "pk",
        },
      }),
    );
    const unmarshalledItems = queryItemResponse.Items?.map((item) =>
      unmarshall(item),
    );
    return {
      statusCode: 200,
      body: JSON.stringify(unmarshalledItems),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify("Unknown error: could not get ingredients."),
  };
}
