// Prints a reminder about the local EventBridge mock bus after serverless
// offline's "Server ready" line, where it can't scroll out of sight. Only
// fires under `serverless offline start` (the plain `offline` command does
// not spawn the ready lifecycle for other plugins).
class LocalDevBanner {
  constructor(serverless) {
    this.serverless = serverless;
    this.hooks = {
      'before:offline:start:ready': () => this.printBanner(),
    };
  }

  printBanner() {
    const config =
      this.serverless.service.custom['serverless-offline-aws-eventbridge'] ||
      {};
    const port = config.port || 4010;
    const bold = '\x1b[1m';
    const magenta = '\x1b[35m';
    const cyan = '\x1b[36m';
    const dim = '\x1b[2m';
    const reset = '\x1b[0m';
    process.stdout.write(
      `\n${bold}${magenta}EventBridge mock bus:${reset} ${cyan}http://localhost:${port}${reset} ${dim}(bus: asap-events-local)${reset} ⚡\n` +
        `${dim}publish test events with: aws events put-events --endpoint-url http://localhost:${port} ...${reset}\n\n`,
    );
  }
}

module.exports = LocalDevBanner;
