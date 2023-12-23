import { marshall } from "@aws-sdk/util-dynamodb";
import { template } from "../template";
import ReactDOMServer from "react-dom/server";
import React from "react";

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

export function generateHTML(app: JSX.Element, scriptRoute: string) {
  return template
    .replace(
      "<!--app-html-->",
      ReactDOMServer.renderToString(<React.StrictMode>{app}</React.StrictMode>),
    )
    .replace(
      "<!--app-script-->",
      `<script
        type="module"
        crossorigin
        src="https://${process.env.BUCKET_URL}${scriptRoute}"
      ></script>`,
    );
}
