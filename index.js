const watcher = require(`@parcel/watcher`)
const path = require(`path`)
const fs = require(`fs-extra`)

const dir = path.resolve(`./tmp`)
const snapshotDir = path.resolve(`./snapshots`)
const snapshotPath = path.join(snapshotDir, `snapshot.txt`)

async function writeFiles(count) {
  for (let i = 0; i < count; i++) {
    await fs.writeFile(path.join(dir, Math.random().toString()), `sup`)
  }
}

async function loop() {
  await watcher.writeSnapshot(dir, snapshotPath)
  await fs.writeFile(path.join(dir, Math.random().toString()), `sup`)
  const events = await watcher.getEventsSince(dir, snapshotPath)
}

async function run() {
  const start = process.memoryUsage()
  for (let i = 0; i < 4; i++) {
    await loop()
  }

  const end = process.memoryUsage()
  console.log(`diff`, {
	  rss: (end.rss - start.rss) / 1024 / 1024,
	  heapUsed: (end.heapUsed - start.heapUsed) / 1024 / 1024,
	  heapTotal: end.heapTotal - start.heapTotal,
	  external: end.external - start.external
  }, end)

}

run()
//writeFiles(5000)
