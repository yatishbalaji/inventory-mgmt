function Product(sequelize, DataTypes) {
  const ProductModel = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_on',
  });

  return ProductModel;
}

module.exports = Product;
