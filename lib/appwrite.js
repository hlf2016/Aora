import {
  END_POINT,
  PLATFORM,
  PROJRCT_ID,
  DATABASE_ID,
  USER_COLLECTION_ID,
  VIDEO_COLLECTION_ID,
  STORAGE_ID,
} from "@env";

export const config = {
  endpoint: END_POINT,
  platform: PLATFORM,
  projectID: PROJRCT_ID,
  databaseID: DATABASE_ID,
  userCollectionID: USER_COLLECTION_ID,
  videoCollectionID: VIDEO_COLLECTION_ID,
  storageID: STORAGE_ID,
};

import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectID) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) {
      throw new Error("create account error");
    }
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseID,
      config.userCollectionID,
      ID.unique(),
      {
        accountID: newAccount.$id,
        username,
        email,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log("create user error", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log("sign in error", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("get current account error");
    }
    const currentUser = await databases.listDocuments(
      config.databaseID,
      config.userCollectionID,
      [Query.equal("accountID", currentAccount.$id)]
    );

    if (!currentUser) {
      throw new Error("get current user error");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log("get current user error", error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseID,
      config.videoCollectionID,
      [Query.orderDesc("$createdAt")]
    );
    return posts.documents;
  } catch (error) {
    throw error;
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseID,
      config.videoCollectionID,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );
    return posts.documents;
  } catch (error) {
    throw error;
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseID,
      config.videoCollectionID,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    throw error;
  }
};

// 这地方用的是 user.$id ，也就是 users 表的 documentID，而不是 accountID
export const getUserPosts = async (userID) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseID,
      config.videoCollectionID,
      [Query.equal("creator", userID)]
    );
    return posts.documents;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file, type) => {
  if (!file) {
    return;
  }
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageID,
      ID.unique(),
      asset
    );
    return await getFilePreview(uploadedFile.$id, type);
  } catch (error) {
    throw error;
  }
};

export const getFilePreview = async (fileID, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFilePreview(config.storageID, fileID);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageID,
        fileID,
        2000,
        2000,
        "top",
        100
      );
    }
    if (!fileUrl) {
      throw new Error("get file preview error");
    }
    return fileUrl;
  } catch (error) {
    throw error;
  }
};

export const createVideoPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseID,
      config.videoCollectionID,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw error;
  }
};

export const collectVideo = async (post) => {
  try {
    const currentUser = await getCurrentUser();
    // console.log(post);
    // console.log(currentUser);
    const res = await databases.updateDocument(
      config.databaseID,
      config.userCollectionID,
      currentUser.$id,
      {
        collectVideos: currentUser.collectVideos.concat(post),
      }
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const getCollectVideos = async () => {
  try {
    const currentUser = await getCurrentUser();
    return currentUser.collectVideos;
  } catch (error) {
    throw error;
  }
};
