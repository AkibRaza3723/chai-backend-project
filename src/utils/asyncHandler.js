const asyncHandler = (fn) => 
   async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
      next(err); // Pass the error to the next middleware (error handling middleware) in the Express.js application, allowing for centralized error handling and response generation. (not necessary to call next(error) after sending a response, but it can be useful for logging or additional error processing in the error handling middleware)
    }
  };
//when we created the function asynchandler we didn't have used the curly braces after the arrow so we don't have to return it 
export { asyncHandler };


// The asyncHandler function is a higher-order function that takes an asynchronous function (fn) as an argument and returns a new function. This new function is designed to handle errors that may occur during the execution of the asynchronous function. It uses a try-catch block to catch any errors that may be thrown and passes them to the next middleware in the Express.js application using next(error). This allows for centralized error handling in the application, making it easier to manage and respond to errors consistently across different routes and controllers.
//passing next because we can use sort of middleware chaining in Express.js, where we can have multiple middleware functions that process a request before sending a response. By passing next as an argument to the asyncHandler, we can ensure that if an error occurs in the asynchronous function, it will be passed to the next middleware function that is designed to handle errors, allowing for proper error handling and response generation in the application.
//const asyncHandler = (fn) => async () => {};
//we can also use promise under ayncHandler like this:
/*
const asyncHandler = (fn) => {
   return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  }
}
*/
// This implementation uses Promise.resolve to handle both synchronous and asynchronous functions. It ensures that any errors thrown by the function will be caught and passed to the next middleware using next(error), allowing for consistent error handling in the Express.js application.


