import CommentLike from "./commentLike.model";
import Comment from "./comments.model";
import Like from "./likes.model";
import PostImage from "./postImages.model";
import Post from "./posts.model";
import User from "./user.model";

// ========== POST ASSOCIATIONS ==========
Post.belongsTo(User, { foreignKey: 'user_id', as: 'User' });  // ✅ Add alias here too
Post.hasMany(Like, { foreignKey: 'post_id', as: 'Likes' });
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'Comments' });
Post.hasMany(PostImage, { foreignKey: 'post_id', as: 'images' });

// ========== POST IMAGE ASSOCIATIONS ==========
PostImage.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// ========== LIKE ASSOCIATIONS ==========
Like.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'Post' });

// ========== COMMENT ASSOCIATIONS ==========
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'User' });  // ✅ Only define ONCE
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'Post' });

// Self-referencing for nested comments
Comment.belongsTo(Comment, { 
  foreignKey: 'parent_comment_id', 
  as: 'ParentComment' 
});
Comment.hasMany(Comment, { 
  foreignKey: 'parent_comment_id', 
  as: 'Replies' 
});

// Comment likes
Comment.hasMany(CommentLike, { 
  foreignKey: 'comment_id', 
  as: 'CommentLikes' 
});

// ========== USER ASSOCIATIONS ==========
User.hasMany(Post, { foreignKey: 'user_id', as: 'Posts' });
User.hasMany(Like, { foreignKey: 'user_id', as: 'Likes' });
User.hasMany(Comment, { foreignKey: 'user_id', as: 'Comments' });
User.hasMany(CommentLike, { foreignKey: 'user_id', as: 'CommentLikes' });

// ========== COMMENT LIKE ASSOCIATIONS ==========
CommentLike.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
CommentLike.belongsTo(Comment, { foreignKey: 'comment_id', as: 'Comment' });