import {
  ECSClient,
  RunTaskCommand,
  StopTaskCommand,
} from '@aws-sdk/client-ecs';
import { getRegion } from '../config';
import type { JobName, JobRunner } from './runner';

export type EcsClientLike = Pick<ECSClient, 'send'>;

const cluster = (): string => process.env.ENCODER_CLUSTER || '';
const taskDefinition = (): string => process.env.ENCODER_TASK_DEFINITION || '';
const containerName = (): string =>
  process.env.ENCODER_CONTAINER_NAME || 'encoder';

const subnets = (): string[] =>
  (process.env.ENCODER_SUBNET_IDS || '')
    .split(',')
    .map((subnet) => subnet.trim())
    .filter(Boolean);

const securityGroups = (): string[] =>
  [process.env.ENCODER_SECURITY_GROUP_ID].filter((group): group is string =>
    Boolean(group),
  );

const runTaskInput = (job: JobName, env: Record<string, string>) => ({
  cluster: cluster(),
  taskDefinition: taskDefinition(),
  launchType: 'FARGATE' as const,
  count: 1,
  platformVersion: 'LATEST',
  networkConfiguration: {
    awsvpcConfiguration: {
      // the task pulls its image from ECR over the internet, there is no NAT
      assignPublicIp: 'ENABLED' as const,
      subnets: subnets(),
      securityGroups: securityGroups(),
    },
  },
  overrides: {
    containerOverrides: [
      {
        name: containerName(),
        environment: [
          { name: 'JOB', value: job },
          ...Object.entries(env).map(([name, value]) => ({ name, value })),
        ],
      },
    ],
  },
});

export const createEcsJobRunner = (
  client: EcsClientLike = new ECSClient({ region: getRegion() }),
): JobRunner => ({
  run: async (job, env) => {
    const { tasks, failures } = await client.send(
      new RunTaskCommand(runTaskInput(job, env)),
    );
    const jobId = tasks?.[0]?.taskArn;
    if (!jobId) {
      throw new Error(
        `RunTask started no ${job} task: ${JSON.stringify(failures ?? [])}`,
      );
    }
    return { jobId };
  },
  stop: async (jobId) => {
    await client.send(
      new StopTaskCommand({
        cluster: cluster(),
        task: jobId,
        reason: 'stopped by the demo hub',
      }),
    );
  },
});
