import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

const data = require("../formattedIngredients.json");

interface InitDataResourceStackProps extends StackProps {
  mealPrepperTable: ITable;
}

export class InitDataResourceStack extends Stack {
  constructor(scope: Construct, id: string, props: InitDataResourceStackProps) {
    super(scope, id, props);

    for (let i = 0; i < data.length; i++) {
      new AwsCustomResource(this, `${i}-initMealPrepperDBResource`, {
        onCreate: {
          service: "DynamoDB",
          action: "batchWriteItem",
          parameters: {
            RequestItems: {
              [props.mealPrepperTable.tableName]: data[i],
            },
          },
          physicalResourceId: PhysicalResourceId.of(
            `${i}-initMealPrepperDBData`,
          ),
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: [props.mealPrepperTable.tableArn],
        }),
      });
    }
  }
}