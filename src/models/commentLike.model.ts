// models/commentLike.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class CommentLike extends Model {
  public id!: number;
  public comment_id!: number;
  public user_id!: number;
  public created_at!: Date;
}

CommentLike.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'CommentLike',
  tableName: 'comment_likes',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['comment_id', 'user_id']
    }
  ]
});

export default CommentLike;