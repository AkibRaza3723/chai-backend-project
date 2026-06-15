class ApiRes {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Determine success based on status code (status codes below 400 are considered successful)
  }
}

export { ApiRes };

//explanation: The ApiRes class is a utility class that represents an API response. It takes in parameters such as statusCode, message, data, and res (the response object). The class sets the properties of the instance based on the provided parameters and determines whether the response is successful based on the status code. This class can be used to standardize API responses in an application, making it easier to handle and format responses consistently across different routes and controllers.