const { Sequelize, Model, DataTypes } = require('sequelize');
const { encrypt, decrypt } = require('./lib');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

// 定义 House 模型
class House extends Model {}
House.init(
  {
    url: {
      type: DataTypes.STRING,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    cover: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    prePrice: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.NUMBER,
    },
    vve: {
      type: DataTypes.STRING,
    },
    publishTime: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    energy: {
      type: DataTypes.STRING,
    },
    rooms: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    watch: {
      type: DataTypes.STRING,
    },
    like: {
      type: DataTypes.STRING,
    },
    video: {
      type: DataTypes.STRING,
    },
    videoPoster: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: 'house' },
);

// 定义 User 模型
class User extends Model {}
User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'user' },
);

// 在创建用户时加密密码
User.beforeCreate((user) => {
  const encryptedPassword = encrypt(user.password);
  user.password = JSON.stringify(encryptedPassword); // 存储加密后的密码和 IV
});

// 自定义方法来解密密码
User.prototype.getDecryptedPassword = function () {
  return decrypt(JSON.parse(this.password));
};

// 定义 Group 模型
class Group extends Model {}
Group.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'group' },
);

// 定义 User 和 Group 之间的关系
User.hasMany(Group, { foreignKey: 'userId' });
Group.belongsTo(User, { foreignKey: 'userId' });

// 定义 Group 和 House 之间的多对多关系
class GroupHouse extends Model {}
GroupHouse.init(
  {
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: Group,
        key: 'id',
      },
    },
    houseId: {
      type: DataTypes.INTEGER,
      references: {
        model: House,
        key: 'id',
      },
    },
  },
  { sequelize, modelName: 'groupHouse' },
);

// 定义 Group 和 House 之间的多对多关系
Group.belongsToMany(House, { through: GroupHouse, foreignKey: 'groupId' });
House.belongsToMany(Group, { through: GroupHouse, foreignKey: 'houseId' });

sequelize.sync({ alter: true });

module.exports = { User, Group, House, GroupHouse };
