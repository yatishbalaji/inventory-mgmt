function Order(sequelize, DataTypes) {
  const OrderModel = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: DataTypes.DECIMAL,
    status: {
      type: DataTypes.ENUM,
      values: ['INIT', 'PENDING', 'SUCCESS', 'FAILED'],
    },
  }, {
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_on',

    classMethods: {
      associate(models) {
        OrderModel.belongsTo(models.User, {
          foreignKey: 'created_by',
        });

        OrderModel.hasMany(models.OrderProduct)
      },
    },
  });

  return OrderModel;
}

module.exports = Order;