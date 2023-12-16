import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {AttributeType, BillingMode, ITable, Table} from "aws-cdk-lib/aws-dynamodb";

export class DataStack extends cdk.Stack {

  public readonly mealPrepperTable: ITable

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.mealPrepperTable = new Table(this, 'RecipeTable', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }
}
