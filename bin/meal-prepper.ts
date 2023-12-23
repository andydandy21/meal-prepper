#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DataStack } from "../lib/DataStack";
import { InitDataResourceStack } from "../lib/InitDataResourceStack";
import { LambdaStack } from "../lib/LambdaStack";
import ApiStack from "../lib/ApiStack";
import { FrontendStack } from "../lib/FrontendStack";

const app = new cdk.App();
const dataStack = new DataStack(app, "MPDataStack");
const frontendStack = new FrontendStack(app, "MPFrontendStack");
new InitDataResourceStack(app, "MPResourceStack", {
  mealPrepperTable: dataStack.mealPrepperTable,
});
const lambdaStack = new LambdaStack(app, "MPLambdaStack", {
  mealPrepperTable: dataStack.mealPrepperTable,
  frontendBucket: frontendStack.assetBucket,
});
new ApiStack(app, "MPApiStack", {
  ingredientLambda: lambdaStack.ingredientLambda,
});
