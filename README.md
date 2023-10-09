# 🏦 Banking API

## Getting Started

### Requirements:
- [Docker](https://www.docker.com/products/docker-desktop/)

### Running the Application:
1. Clone the repository:
    ```bash
    git clone https://github.com/Tiffany8/Banking.git
    cd Banking
    ```

2. Build and start the services:
    ```bash
    docker-compose up --build app
    ```

3. Access the server at [http://localhost:8080](http://localhost:8080)

### Running the Tests:
1. Execute tests:
    ```bash
    docker-compose run --build test
    ```

## API Documentation

Access Swagger documentation with example requests at [http://localhost:8080/documentation](http://localhost:8080/documentation) when the server is running.

## Pain Points/Frustrations:

- **SQLite3**:
   - Lack of native async/await support led to verbose code while wrapping SQLite's callback-based API in Promises.
   - Adapting to SQLite-specific SQL syntax and conventions posed challenges, especially the absence of common SQL functions like CONCAT.
   - The mix of synchronous and asynchronous methods added complexity, especially when integrating with an asynchronous environment like Fastify.

- **Error Handling**: 
   - Floating promises led to unhandled promise rejections, complicating debugging.

- **Schema Validation**:
   - I'd used Zod previously and recall having some difficulties with it, so was curious about Yup for schema validation. I found Yup less minimalist. Sparse documentation on integrating `fastify-yup-swagger` posed challenges, but I stumbled upon recent `fastify-type-provider` for [Yup](https://github.com/jorgevrgs/fastify-type-provider-yup) that simplified the Swagger setup. Considering exploring Typebox next.
        - Note -- encountered a limitation where the library doesn't support accurate representation of arrays of specific object schemas (see /transfers endpoint schema)
   - Configuring Swagger UI for API documentation was challenging

- **ESLint Configuration in VSCode**:
   - I had to tweak and update ESLint settings in VSCode as initial settings weren't sufficiently customized for node projects, leading to some eslint-ignore statements in the code.

- **Logging**:
   - The current logging setup lacks adequate information for effective debugging.

## Future Directions:

- **Error Handling Improvements**:
   - Plan to implement a global error handler for catching unhandled errors and rejections.

- **Logging Enhancements**:
   - Aim to incorporate a centralized logging system like ELK Stack for better observability.

- **CI/CD Setup**:
   - Will set up a CI/CD pipeline for automating testing and deployment, ensuring a reliable delivery process.

- **Monitoring and Alerting**:
   - Intend to implement monitoring and alerting tools for proactive issue detection.

- **Docker Setup**:
   - Plan to decrease the Dockerfile size by employing a multi-stage setup where only compiled files are copied into the image.

- **Pagination Enhancements**:
   - Include `offset`, `limit`, and `count` parameters in the response to provide clearer pagination information.
   - Potentially transition to cursor-based pagination for a more scalable and user-friendly pagination experience.

## Contact

- Tiffany Williams - tiffany@tiffanyphd.dev
