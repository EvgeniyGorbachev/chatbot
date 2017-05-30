const db = require('../models/index.js')
const schedule = require('node-schedule')

// Check conversation pause every 1 minutes
let j = schedule.scheduleJob('*/1 * * * *', function(){
  console.log('Cron work every 1 minute!');

  let twoMinutesLater = new Date();
  twoMinutesLater.setMinutes(twoMinutesLater.getMinutes() - 2);

  db.sequelize.query("SELECT * FROM conversations WHERE \"isPaused\" = 'true' AND \"pausedTime\" < '" + twoMinutesLater.toISOString() + "'").spread((conversations, metadata) => {
    if (conversations.length > 0) {
      console.log('Cron conversation: ', conversations)
      conversations.forEach(function(conversation) {
        db.Conversations.findOne({where: { id: conversation.id }}).then(function (conv) {

          conv.update({
            isPaused: false,
            pausedTime:  null
          }).then(function () {

          }).catch(function (err) {
            console.log('cron err 111111: ', err)
          })

        }).catch(function(err) {
          console.log('cron err 22222: ', err)
        })
      })
    } else {
      console.log('No cron work')
    }
  })
})