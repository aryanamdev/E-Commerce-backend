import Collection from "mongoose";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";

/***********************************
@create_COLLECTION

@route http://localhost:4000/api/collection
@description User signup controller for creating a new user
@parameters
@return User Object()
***********************************/

export const createCollection = asyncHandler(async (req, res) => {
  // take name from req
  const { name } = req.body;

  if (!name) {
    throw new customError("Collection Name is required", 400);
  }
  const collection = await Collection.create({ name });

  res.status(200).json({
    success: true,
    message: "Collection created",
    collection,
  });
});

// send this response to the frontend

export const updateCollection = asyncHandler(async (req, res) => {
  //get existing value to be updated and new value to be updated
  const { id: collectionId } = req.params;

  const { name } = req.body;

  const collection = await Collection.findByIdAndUpdate(
    collectionId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateCollection) {
    throw new customError("Collection not found", 400);
  }

  // send response to the front

  res.status(200).json({
    success: true,
    message: "Collection Updated successfully",
    updateCollection,
  });
});

// delete collection

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.body;

  const collectionToDelete = await Collection.findByIdAndUpdate(collectionId);

  if (!collectionToDelete) {
    throw new customError("Collection not deleted");
  }

  res.status(200).json({
    success: true,
    messasge: "Collection Deleted Successfully!",
  });
});

// get all collectons

const getAllCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find();

  if (!collections) {
    throw new customError("No collection found!", 400);
  }

  res.status(200).json({
    success: true,
    collections
  })
});
