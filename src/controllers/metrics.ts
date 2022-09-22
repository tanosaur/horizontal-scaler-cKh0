import { sdk } from "../gql/clients";
import { PROJECT_ID, ENVIRONMENT_ID } from "../constants";

export const getMetrics = async (
  serviceId: string,
): Promise<
  {
    cpu: number;
    memory: number;
  }
> => {
  const metrics = (
    await sdk.MetricsForService({
      projectId: PROJECT_ID,
      environmentId: ENVIRONMENT_ID,
      serviceId: serviceId,
      // Last 1 minute
      startDate: new Date(Date.now() - 60000).toISOString(),
    })
  ).metricsForService.deployments[0].metrics;
  let cpu = 0;
  let memory = 0;
  if (metrics.length > 0) {
    cpu = metrics.at(-1)!.cpuPercentVCPU ?? 0;
    memory =
      (metrics.at(-1)!.memoryUsageBytes / metrics.at(-1)!.memoryLimitBytes) *
      100;
  }
  return { cpu: cpu, memory: memory };
};
