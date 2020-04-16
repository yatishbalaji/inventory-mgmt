function OrderProduct(sequelize, DataTypes) {
  const OrderProductModel = sequelize.define('OrderProduct', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: DataTypes.DECIMAL,
    qty:  DataTypes.INTEGER,
  }, {
    tableName: 'order_products',
    underscored: true,
    timestamps: false,

    classMethods: {
      associate(models) {
        OrderProductModel.belongsTo(models.Order, {
          foreignKey: 'order_id',
        });

        OrderProductModel.belongsTo(models.Product, {
          foreignKey: 'product_id',
        });
      },
    },
  });

  return OrderProductModel;
}

module.exports = OrderProduct;