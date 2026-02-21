const chalk = new (require("chalk").Chalk)();
const morgan = require("morgan");

// ----------------------------------------- //

// Custom token for colored status code
morgan.token("colored-status", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return status;
});

// Custom format with colors
const coloredFormat = `${chalk.blue("[Morgan]")} ${chalk.gray(":date[iso]")} - ${chalk.magenta(":method")} ${chalk.cyan(":url")} - ${chalk.whiteBright(":colored-status")} - ${chalk.yellow(":response-time ms")}`;

module.exports = morgan(coloredFormat);
