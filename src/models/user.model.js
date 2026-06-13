import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"; // Importing bcrypt for password hashing
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for generating and verifying JWT tokens
//here we use pre middleware, which is used to perfrom certain operations just before saving the document to the database.

//we have imported schema so we dont have to write mongoose.Schema every time we define a schema, we can just use Schema directly.
const userSchema = new Schema({
   username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      index: true, // Create an index on the username field for faster queries
      match: [/^[a-zA-Z0-9]+$/, "Username can only contain alphanumeric characters"]
   },
   email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true
   },
   fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,// Remove leading and trailing whitespace
      index: true,
   },
    avatar: {
        type: String,//cloudinary url
        trim: true,
        required: true,
    },
    coverImage: {
        type: String,//cloudinary url
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video", // Reference to the Video model
    }],
    Password: {
        type: String,//why string? because we will store the hashed password as a string in the database, not the plain text password. The hashed password is generated using a hashing algorithm (like bcrypt) and is stored as a string representation of the hash.
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    refreshToken: {
        type: String,
        //what is refresh token? A refresh token is a long-lived token that is used to obtain a new access token without requiring the user to re-authenticate. It is typically issued alongside an access token and has a longer expiration time. When the access token expires, the client can use the refresh token to request a new access token from the server, allowing for seamless user experiences without frequent logins.
        default: null, // Set default value to null if no refresh token is provided
    },
},
{
timestamps: true // Automatically add createdAt and updatedAt fields to the schema
}
);

//we use the validation save so that it do the work just before saving
//here we dont use arrow function because we want to use `this` keyword which refers to the current document being saved, and arrow functions do not have their own this context, so we use regular function syntax to access the document's properties correctly. (data nhi ayega userschema ke andar ka)
//used next because it is a callback function that is called to indicate that the middleware has completed its task and the next middleware in the stack can be executed. In this case, after hashing the password, we call next() to proceed with saving the user document to the database.
userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) {
        return next(); // If the password is not modified, skip hashing and proceed to the next middleware
    }
    try {
        this.Password = await bcrypt.hash(this.Password, 10); // Hash the password using the generated salt
        next(); // Proceed to the next middleware after hashing
    } catch (error) {
        next(error); // Pass any errors to the next middleware for error handling
    }
});

//now we will create a method to compare the entered password with the hashed password stored in the database. This method will be used during the login process to verify the user's credentials.
userSchema.methods.isPasswordCorrect = async function (Password) {
    return await bcrypt.compare(Password, this.Password); // Compare the entered password with the hashed password
};

//we will also create a method to generate a JWT token for the user, which can be used for authentication and authorization purposes in the application.(it's like a key that the user can use to access protected routes and resources in the application, and it contains encoded information about the user, such as their ID and other relevant data, which can be verified by the server to ensure the authenticity of the token and the user's identity.)
userSchema.methods.generateAccessToken = function () {
    const acesstoken = jwt.sign(
        {  
            _id: this._id,
            username: this.username, 
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
    return acesstoken;
};
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        { 
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
    return refreshToken;
};

//why we are using methods? Because it allows us to define instance methods that can be called on individual user documents, enabling us to perform operations like password comparison and token generation directly on the user instances, which promotes code reusability and encapsulation of user-related functionality within the model itself.
//diffrence between access token and refresh token? Access tokens are short-lived tokens that are used to access protected resources and typically have a short expiration time (e.g., 15 minutes to 1 hour). Refresh tokens, on the other hand, are long-lived tokens that are used to obtain new access tokens without requiring the user to re-authenticate. They typically have a longer expiration time (e.g., days or weeks) and are stored securely on the client side. When an access token expires, the client can use the refresh token to request a new access token from the server, allowing for seamless user experiences without frequent logins. when refresh token expires, the user will have to log in again to obtain new tokens.

export const User = mongoose.model("User", userSchema);