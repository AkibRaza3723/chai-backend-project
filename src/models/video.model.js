import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
      videoFile: {
        type: String, //cloudinary url
        required: [true, "Video file is required"],
      },
      thumbnail: {
        type: String, //cloudinary url
        required: [true, "Thumbnail is required"],
      },
      title: {
        type: String,
        required: [true, "Title is required"],
      },
        description: {
        type: String,
        required: [true, "Description is required"],
      },
      duration: {
        type: Number, // Duration in seconds from cloudinary metadata
        required: [true, "Duration is required"],
        },
      views: {
        type: Number,
        default: 0, // Default value for views is 0
      },
      ispublished: {
        type: Boolean, // Indicates whether the video is published or not
        default: true, // Default value for isPublished is true
      },
      Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner is required"],
      }
    },
{
timestamps: true // Automatically add createdAt and updatedAt fields to the schema
}
);

videoSchema.plugin(mongooseAggregatePaginate);
//why mongooseAggregatePaginate? It is a plugin for Mongoose that adds pagination capabilities to the aggregate function. It allows you to easily paginate the results of an aggregation query, which is useful when dealing with large datasets. By using this plugin, you can specify the page number and the number of items per page, and it will return the corresponding subset of results along with pagination metadata (like total pages, total items, etc.). This is particularly helpful for implementing features like infinite scrolling or paginated lists in applications that use MongoDB as their database.
//why used in video not in user? Because we will be fetching videos in a paginated manner, especially when we have a large number of videos. For users, we typically fetch them based on specific criteria (like username or email) rather than paginating through a large list of users, so the pagination plugin is more relevant for the video model where we expect to have many entries and need to manage the results efficiently. 
//rather than thing like find() or findOne() we are using aggregate? Because aggregate allows us to perform more complex queries and transformations on the data, such as grouping, sorting, and filtering, which can be useful when we want to implement features like searching, sorting by views, or filtering videos based on certain criteria. Using aggregate with pagination can help us efficiently retrieve and display video data in a way that meets the needs of our application.

export const Video = mongoose.model("Video", videoSchema);