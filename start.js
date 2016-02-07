cronJob = require('cron').CronJob

  cronTest = new cronJob('*/10 * * * * *', () => {
    console.log("jikan");
  })

  cronTest.start()
