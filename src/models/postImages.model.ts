// models/postImage.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class PostImage extends Model {
  public id!: number;
  public post_id!: number;
  public image_url!: string;
  public display_order!: number;
  public created_at!: Date;
}

PostImage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'PostImage',
  tableName: 'post_images',
  timestamps: false,
});

export default PostImage;