import { generateUpdateExpression } from "../util/util";

describe("Test utility methods", () => {
  test("generateUpdateExpression should return proper expression in Dynamodb format", () => {
    const changeForm = {
      protein: 5,
      carbohydrate: 10,
      totalFat: 2,
    };
    const expression = generateUpdateExpression(changeForm);
    const expectedObj = {
      UpdateExpression:
        "SET #protein = :protein, #carbohydrate = :carbohydrate, #totalFat = :totalFat",
      ExpressionAttributeNames: {
        "#protein": "protein",
        "#carbohydrate": "carbohydrate",
        "#totalFat": "totalFat",
      },
      ExpressionAttributeValues: {
        ":protein": 5,
        ":carbohydrate": 10,
        ":totalFat": 2,
      },
    };

    expect(expression).toEqual(expectedObj);
  });
});
