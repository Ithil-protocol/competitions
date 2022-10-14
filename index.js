const fs = require("fs");
const { BigNumber } = require("@ethersproject/bignumber");
require("dotenv").config();

const { STRATEGIES } = require("./const");

async function getEvents(strategy, startBlock, endBlock) {
  const openedEventsFilter = strategy.filters.PositionWasOpened();
  const openedEvents = await strategy.queryFilter(
    openedEventsFilter,
    startBlock,
    endBlock
  );
  const closedEventsFilter = strategy.filters.PositionWasClosed();
  const closedEvents = await strategy.queryFilter(
    closedEventsFilter,
    startBlock,
    endBlock
  );

  return openedEvents.map((openedEvent) => {
    const matchedClosedEvents = closedEvents.filter((ev) =>
      BigNumber.from(openedEvent.args[0]).eq(BigNumber.from(ev.args[0]))
    );
    return {
      id: openedEvent.args[0].toString(),
      opened: openedEvent,
      closed: matchedClosedEvents.length ? matchedClosedEvents[0] : null,
    };
  });
}

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
  const mtsEvents = await getEvents(
    STRATEGIES.MarginTradingStrategy,
    startBlock,
    endBlock
  );
  fs.writeFileSync("MarginTradingStrategy.json", JSON.stringify(mtsEvents));
  console.log("'MarginTradingStrategy.json' is created!");

  // Yearn Strategy
  const ysEvents = await getEvents(
    STRATEGIES.YearnStrategy,
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
