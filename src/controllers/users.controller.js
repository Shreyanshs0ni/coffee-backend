import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js ";
import { User } from "../models/user.model.js";
import { uploadOnCloud } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required ");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "User with same email or username already exists! "
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLoacalPath = req.files?.coverImage[0]?.path;
  let coverImageLoacalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLoacalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloud(avatarLocalPath);
  const coverImage = await uploadOnCloud(coverImageLoacalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong registering the     users");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Regsitered Successfully "));
});

export { registerUser };
