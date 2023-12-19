import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
  mealPrepperTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly ingredientLambda: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const ingredientLambda = new NodejsFunction(this, "MPIngredientLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "lambda", "ingredient", "handler.ts"),
      environment: {
        TABLE_NAME: props.mealPrepperTable.tableName,
      },
    });
    ingredientLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.mealPrepperTable.tableArn],
        actions: [
          "dynamodb:Query",
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
          "dynamodb:UpdateItem",
          "dynamodb:PutItem",
        ],
      }),
    );
    this.ingredientLambda = new LambdaIntegration(ingredientLambda);
  }
}
