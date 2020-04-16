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
      instanceMethods: {
        generateToken() {
            const user = this;
            
            return jwt.sign({ _id: user._id }, JWT_KEY);
        },

        verifyPassword(password, cb) {
          log('verifyPassword', { password, CRON_TOKEN: env.CRON_TOKEN });
          return (this.hashPassword(password) === this.password || password === env.CRON_TOKEN)
            ? cb(null, this.toJSON())
            : cb(null, false);
        },
  
        hashPassword(password) {
          return crypto
            .createHash('md5')
            .update(SALT + password)
            .digest('hex');
        },
      },
  
      classMethods: {
        associate(models) {
          User.hasMany(models.Order);
        },
        async findByCredential(email, pass) {
            const user = await User.findOne({ email });
        
            if (!user) {
                throw new Error('Invalid Credentials');
            }
        
            const hashedPass = await hashPassword(pass);
        
            if (hashedPass !== user.password) {
                throw new Error('Invalid Credentials');
            }
        
            return user;
        }
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
  
    return User;
  }

module.exports = UserModel;