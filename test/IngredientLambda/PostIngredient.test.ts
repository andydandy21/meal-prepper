import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { handler } from "../../lambda/ingredient/handler";

describe("Test ingredient lambda handler with POST method", () => {
  const ddbMock = mockClient(DynamoDBClient);

  beforeEach(() => ddbMock.on(PutItemCommand).resolves({}));
  afterEach(() => ddbMock.reset());

  test("POST request with correct object returns 200 with the item returned", async () => {
    const form = {
      name: "egg",
    };

    const res = await handler(
      {
        httpMethod: "POST",
        body: JSON.stringify(form),
      } as any,
      {} as any,
    );

    const expectedObj = {
      message: "OK",
      item: {
        pk: "#IngredientList#",
        name: "egg",
      },
    };

    expect(res.statusCode).toEqual(201);
    expect(JSON.parse(res.body)).toMatchObject(expectedObj);
    expect(JSON.parse(res.body).item.sk).toMatch(
      new RegExp("ingredient#[a-zA-Z0-9_]*"),
    );
  });

  test("POST object without name return validation error", () => {
    const form = {
      protein: 10,
    };

    const res = handler(
      {
        httpMethod: "POST",
        body: JSON.stringify(form),
      } as any,
      {} as any,
    );

    expect(res).resolves.toEqual({
      statusCode: 400,
      body: JSON.stringify("Value for name expected."),
    });
  });
});
