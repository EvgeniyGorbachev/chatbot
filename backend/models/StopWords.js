let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
    let stop_words = sequelize.define('stop_words', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        word: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            get      : function()  {
                return moment(this.getDataValue('createdAt')).format("MM/DD/YYYY");
            }
        },
        updatedAt: {
            type: Sequelize.DATE,
            get      : function()  {
                return moment(this.getDataValue('updatedAt')).format("MM/DD/YYYY");
            }
        }
    }, {
        individualHooks: true,
        tableName: 'stop_words',
      classMethods:{
        associate:function(models){
          stop_words.belongsToMany(models.Conversations, {through: 'stopWordHasConversation', foreignKey: 'stop_word_id', otherKey: 'conversation_id'})
        }
      }
    });
  return stop_words;
};