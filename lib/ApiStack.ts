import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";

interface ApiStackProps extends StackProps {
  ingredientLambda: LambdaIntegration;
}

export default class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "MealPrepApi");

    const ingredientResource = api.root.addResource("ingredient");
    ingredientResource.addMethod("GET", props.ingredientLambda);
    ingredientResource.addMethod("POST", props.ingredientLambda);

    const ingredientDetailResource = ingredientResource.addResource("{id}");
    ingredientDetailResource.addMethod("GET", props.ingredientLambda);
    ingredientDetailResource.addMethod("PUT", props.ingredientLambda);
    ingredientDetailResource.addMethod("DELETE", props.ingredientLambda);
  }
}
