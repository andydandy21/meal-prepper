import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../../lambda/ingredient/handler";

describe("Test ingredient lambda handler with GET method", () => {
  const ddbMock = mockClient(DynamoDBClient);

  afterEach(() => ddbMock.reset());

  test("GET with path parameter should return 200 with object", () => {
    ddbMock.on(GetItemCommand).resolves({
      Item: {
        pk: { S: "#IngredientList#" },
        sk: { S: "ingredient#1" },
        name: { S: "egg" },
      },
    });

    const res = handler(
      {
        httpMethod: "GET",
        pathParameters: { id: "1" },
      } as any,
      {} as any,
    );

    expect(res).resolves.toEqual({
      statusCode: 200,
      body: JSON.stringify({
        pk: "#IngredientList#",
        sk: "ingredient#1",
        name: "egg",
      }),
    });
  });

  test("No Item in GetItemOutput should return 400 with proper message", () => {
    ddbMock.on(GetItemCommand).resolves({});
    const res = handler(
      {
        httpMethod: "GET",
        pathParameters: { id: "0" },
      } as any,
      {} as any,
    );

    expect(res).resolves.toEqual({
      statusCode: 400,
      body: JSON.stringify(`Ingredient with id 0 not found`),
    });
  });

  test("GET method without pathParameters should return 200 with an array of objects", () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          pk: { S: "#IngredientList#" },
          sk: { S: "ingredient#1" },
          name: { S: "egg" },
        },
      ],
    });

    const res = handler(
      {
        httpMethod: "GET",
      } as any,
      {} as any,
    );

    expect(res).resolves.toEqual({
      statusCode: 200,
      body: JSON.stringify([
        {
          pk: "#IngredientList#",
          sk: "ingredient#1",
          name: "egg",
        },
      ]),
    });
  });
});
