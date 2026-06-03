FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy maven wrapper files first (better caching)
COPY mvnw mvnw
COPY .mvn .mvn

# Copy pom.xml and source code
COPY pom.xml .
COPY src src

# Make mvnw executable and build
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Run the application
EXPOSE 9090
CMD ["java", "-jar", "target/*.jar"]