FROM openjdk:17-jdk-slim
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests
EXPOSE 9090
CMD ["java", "-jar", "target/*.jar"]