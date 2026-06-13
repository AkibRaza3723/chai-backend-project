class ApiError extends Error {
    constructor(
        statusCode,
         message = "something went wrong",
         errors = [],
         stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }   
    }
}
export { ApiError };

//explaination: The ApiError class is a custom error class that extends the built-in Error class in JavaScript. It is designed to represent API errors in a structured way, allowing for consistent error handling and response generation in an application. The constructor takes several parameters, including statusCode, message, errors, and stack, which are used to set the properties of the ApiError instance. The class also captures the stack trace for debugging purposes if a stack trace is not provided. This custom error class can be used throughout an application to throw and handle API errors in a standardized manner, making it easier to manage error responses and provide meaningful feedback to clients.