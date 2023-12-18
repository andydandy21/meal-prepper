import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { handler } from "../../lambda/ingredient/handler";

describe("Test ingredient lambda handler with PUT method", () => {
  const ddbMock = mockClient(DynamoDBClient);

  beforeEach(() =>
    ddbMock.on(UpdateItemCommand).resolves({
      Attributes: {
        pk: { S: "#IngredientList#" },
        sk: { S: "ingredient#1" },
        name: { S: "egg" },
        protein: { N: "10" },
      },
    }),
  );
  afterEach(() => ddbMock.reset());

  test("PUT method with form object returns 200 with proper message", () => {
    const form = {
      protein: 10,
    };

    const res = handler(
      {
        httpMethod: "PUT",
        pathParameters: { id: "1" },
        body: JSON.stringify(form),
      } as any,
      {} as any,
    );

    const expectedObject = {
      pk: "#IngredientList#",
      sk: "ingredient#1",
      name: "egg",
      protein: 10,
    };

    expect(res).resolves.toEqual({
      statusCode: 200,
      body: JSON.stringify(expectedObject),
    });
  });

  test("PUT method with form object returns 200 with proper message", () => {
    const form = {
      protein: 10,
    };

    const res = handler(
      {
        httpMethod: "PUT",
        body: JSON.stringify(form),
      } as any,
      {} as any,
    );

    expect(res).resolves.toEqual({
      statusCode: 400,
      body: JSON.stringify("Please provide right args."),
    });
  });
});
