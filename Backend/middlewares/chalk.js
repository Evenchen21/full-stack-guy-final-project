// Chalk - Morgan Middleware for Colored Logging //
const chalk = new (require("chalk").Chalk)();
const morgan = require("morgan");

// --------------------------------------------- //

// Custom token for colored status code //
morgan.token("colored-status", (req, res) => {
  const status = Number(res.statusCode) || 0;
  const statusText = String(status);

  if (status >= 500) return chalk.red(statusText);
  if (status >= 400) return chalk.yellow(statusText);
  if (status >= 300) return chalk.cyan(statusText);
  if (status >= 200) return chalk.green(statusText);
  return statusText;
});

// Custom format with colors //

const coloredFormat = `${chalk.blue("[Morgan]")} ${chalk.gray(":date[iso]")} - ${chalk.magenta(":method")} ${chalk.cyan(":url")} - :colored-status - ${chalk.yellow(":response-time ms")}`;

module.exports = morgan(coloredFormat);
