/**
 * @model gener
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { JWT_KEY, SALT } = require('../../config/environment');

function UserModel (sequelize, DataTypes) {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: { type : DataTypes.STRING },
      email: { type : DataTypes.STRING },
      password: { type : DataTypes.STRING },
    }, {
      tableName: 'users',
      timestamps: false,
      underscored: true,
  
      classMethods: {
        associate(models) {
          User.hasMany(models.Order);
        },
      },
  
      hooks: {
        beforeCreate: function beforeCreate(instance) {
          if (instance.changed('password')) {
            instance
              .set('password', instance.hashPassword(instance.password));
          }

          return instance;
        },
      },
    });

    User.hashPassword = (password) => {
      return crypto
        .createHash('md5')
        .update(SALT + password)
        .digest('hex');
    }

    User.findByCredential = async(email, pass) => {
      const user = await User.findOne({
        where: { email },
      });
  
      if (!user) {
          throw new Error('Invalid Credentials');
      }
  
      const hashedPass = await User.hashPassword(pass);
  
      if (hashedPass !== user.password) {
          throw new Error('Invalid Credentials');
      }

      return user;
    }

    User.prototype.generateToken = function() {
      const user = this;

      return jwt.sign({ id: user.id }, JWT_KEY);
    };

    return User;
  }

module.exports = UserModel;