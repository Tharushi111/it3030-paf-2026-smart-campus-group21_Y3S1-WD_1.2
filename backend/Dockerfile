FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 9090

CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]