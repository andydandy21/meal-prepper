#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DataStack } from "../lib/DataStack";
import { InitDataResourceStack } from "../lib/InitDataResourceStack";
import { LambdaStack } from "../lib/LambdaStack";

const app = new cdk.App();
const dataStack = new DataStack(app, "MPDataStack");
new InitDataResourceStack(app, "MPResourceStack", {
  mealPrepperTable: dataStack.mealPrepperTable,
});
const lambdaStack = new LambdaStack(app, "MPLambdaStack", {
  mealPrepperTable: dataStack.mealPrepperTable,
});
