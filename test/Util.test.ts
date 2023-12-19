import { generateUpdateExpression } from "../util/util";

describe("Test utility methods", () => {
  test("generateUpdateExpression should return proper expression in Dynamodb format", () => {
    const changeForm = {
      name: "updated name",
      protein: 5,
      carbohydrate: 10,
      totalFat: 2,
    };
    const expression = generateUpdateExpression(changeForm);
    const expectedObj = {
      UpdateExpression:
        "SET #name = :name, #protein = :protein, #carbohydrate = :carbohydrate, #totalFat = :totalFat",
      ExpressionAttributeNames: {
        "#name": "name",
        "#protein": "protein",
        "#carbohydrate": "carbohydrate",
        "#totalFat": "totalFat",
      },
      ExpressionAttributeValues: {
        ":name": { S: "updated name" },
        ":protein": { N: "5" },
        ":carbohydrate": { N: "10" },
        ":totalFat": { N: "2" },
      },
    };

    expect(expression).toEqual(expectedObj);
  });
});
