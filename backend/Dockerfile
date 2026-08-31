FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN apt-get update && apt-get install -y maven

RUN mvn clean package -DskipTests

CMD ["sh", "-c", "java -jar target/*.jar"]