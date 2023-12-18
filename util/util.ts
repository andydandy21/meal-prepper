export function GenerateUpdateExpression(obj) {
  let exp = {
    UpdateExpression: "set",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };
  for (const [key, value] of Object.entries(obj)) {
    exp.UpdateExpression += ` #${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = value;
  }
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
}
