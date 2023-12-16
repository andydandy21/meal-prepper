import { App } from "aws-cdk-lib";
import { DataStack } from "../lib/DataStack";
import { InitDataResourceStack } from "../lib/InitDataResourceStack";
import { Template } from "aws-cdk-lib/assertions";

// run tests for DataStack and InitDataResourceStack
test("Dynamodb Table Created", () => {
  const app = new App();

  // init data stack with AWS custom resource before creating templates
  const dataStack = new DataStack(app, "MPDataStack");
  const initDataResourceStack = new InitDataResourceStack(
    app,
    `MPResourceStack`,
    {
      mealPrepperTable: dataStack.mealPrepperTable,
    },
  );

  // create templates
  const recipeDataStackTemplate = Template.fromStack(dataStack);
  const initDataOneTemplate = Template.fromStack(initDataResourceStack);

  // check that the ddb table exists and is on-demand billing
  recipeDataStackTemplate.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
  });

  // AWS Custom Resource for initial data should not change in the foreseeable future, fail test if changed
  expect(initDataOneTemplate.toJSON()).toMatchSnapshot();
}); // end test
