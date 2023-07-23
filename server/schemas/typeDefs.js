const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Like {
    _id: ID!
    createdAt: String!
    username: String!
  }
  type Comment {
    _id: ID!
    commentText: String!
    createdAt: String!
    username: String!
    likes: [Like]!
  }
  type Post {
    _id: ID!
    postText: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
  }
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    website: String
    linkedin: String
    github: String
    posts: [Post]
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user: User
    users: [User]
    posts: [Post]
    comments: [Comment]
    post(postID: ID!): Post
    comment(commentId: ID!): Comment
  }

  type Mutation {
    addUser(
      username: String!
      email: String!
      password: String!
      website: String
      linkedin: String
      github: String
    ): Auth
    updateUser(
      username: String
      email: String
      password: String
      website: String
      linkedin: String
      github: String
    ): Auth

    login(email: String!, password: String!): Auth

    addPost(postText: String!): Post!
    addComment(postId: ID!, commentText: String!): Post
    removePost(postId: ID!): String
    removeComment(commentId: ID!): String
    likePost(postId: ID!): Post!
    likeComment(commentId: ID!): Comment!
  }
`;

module.exports = typeDefs;
