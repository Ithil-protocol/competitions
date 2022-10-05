const fs = require("fs");
require("dotenv").config();

const { STRATEGIES } = require("./const");

async function main() {
  const startBlock = Number(process.argv[2]);
  const endBlock = Number(process.argv[3]);

  if (!startBlock || !endBlock) {
    console.error("Invalid arguments!");
    return;
  }
  if (startBlock > endBlock) {
    console.error("'startBlock' should be lower than 'endBlock'");
    return;
  }

  // Margin Trading Strategy
  const mtsEventFilter =
    STRATEGIES.MarginTradingStrategy.filters.PositionWasClosed();
  const mtsEvents = await STRATEGIES.MarginTradingStrategy.queryFilter(
    mtsEventFilter,
    startBlock,
    endBlock
  );
  fs.writeFileSync("MarginTradingStrategy.json", JSON.stringify(mtsEvents));
  console.log("'MarginTradingStrategy.json' is created!");

  // Yearn Strategy
  const ysEventFilter = STRATEGIES.YearnStrategy.filters.PositionWasClosed();
  const ysEvents = await STRATEGIES.YearnStrategy.queryFilter(
    ysEventFilter,
    startBlock,
    endBlock
  );
  fs.writeFileSync("YearnStrategy.json", JSON.stringify(ysEvents));
  console.log("'YearnStrategy.json' is created!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
