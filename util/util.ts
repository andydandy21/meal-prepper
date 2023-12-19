import { marshall } from "@aws-sdk/util-dynamodb";

export function generateUpdateExpression(obj: any) {
  let exp = {
    UpdateExpression: "SET",
    ExpressionAttributeNames: {} as any,
    ExpressionAttributeValues: {} as any,
  };
  for (const [key, value] of Object.entries(obj)) {
    exp.UpdateExpression += ` #${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = marshall(value);
  }
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
}
