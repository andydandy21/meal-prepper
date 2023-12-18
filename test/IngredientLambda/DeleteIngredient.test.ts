import { mockClient } from "aws-sdk-client-mock";
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { handler } from "../../lambda/ingredient/handler";

describe("Test ingredient lambda handler with GET method", () => {
  const ddbMock = mockClient(DynamoDBClient);

  beforeEach(() => ddbMock.on(DeleteItemCommand).resolves({}));
  afterEach(() => ddbMock.reset());

  test("DELETE request with id path parameter returns 200 with proper message", () => {
    const res = handler(
      {
        httpMethod: "DELETE",
        pathParameters: { id: "1" },
      } as any,
      {} as any,
    );

    expect(res).resolves.toEqual({
      statusCode: 200,
      body: JSON.stringify("Deleted ingredient with id 1"),
    });
  });

  test("DELETE request without id path parameter returns 400 with proper message", () => {
    const res = handler(
      {
        httpMethod: "DELETE",
      } as any,
      {} as any,
    );

    expect(res).resolves.toEqual({
      statusCode: 400,
      body: JSON.stringify("Error: id required"),
    });
  });
});
