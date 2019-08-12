# Create new Project

You can create a new project from scratch by following theese tutorials:

1. [Building Java Projects with Maven](https://spring.io/guides/gs/maven/)
2. [Building an Application with Spring Boot](https://spring.io/guides/gs/spring-boot/)

But it's simpler to use [start.spring.io](https://start.spring.io/), just set the parameters and download the zipped project. You can use the default configuration, just add the dependency [Spring Web Starter](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web).

In the file `/src/main/resources/application.properties` add the following line see logs:

```
logging.level.org.springframework.web: DEBUG
```

The current project do not possess any route, so by running the server we will always receive `404 NOTFOUND`

## Maven Wrapper

The zipped project from [start.spring.io](https://start.spring.io/) includes [takari/maven-wrapper](https://github.com/takari/maven-wrapper), which helps all memebers of a team to use the same maven version. On linux you have to set `mvnw` file as executable, then you can use `./mvnw` instad of `mvn`.

```bash
cd spring-questions-backend/

mvn -v
Apache Maven 3.6.1 (d66c9c0b3152b2e69ee9bac180bb8fcc8e6af555; 2019-04-04T19:00:29Z)
Maven home: /usr/share/maven
Java version: 1.8.0_171, vendor: Oracle Corporation, runtime: /usr/lib/jvm/java-1.8-openjdk/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "4.15.0-55-generic", arch: "i386", family: "unix"

./mvnw -v
Apache Maven 3.6.0 (97c98ec64a1fdfee7767ce5ffb20918da4f719f3; 2018-10-24T18:41:47Z)
Maven home: /root/.m2/wrapper/dists/apache-maven-3.6.0-bin/2dakv70gp803gtm5ve1ufmvttn/apache-maven-3.6.0
Java version: 1.8.0_171, vendor: Oracle Corporation, runtime: /usr/lib/jvm/java-1.8-openjdk/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "4.15.0-55-generic", arch: "i386", family: "unix"
```

Unfortunately there is a problem with mvnw and docker, see ["mvnw" won't work on docker-pipeline with the "maven" image because docker-pipeline doesn't honor docker image entrypoint](https://issues.jenkins-ci.org/browse/JENKINS-47890) and its workarounds.

Since docker already ensure that all members use the same maven version, we won't use `mvnw`, but I will still hold the files `mvnw` and `mvnw.cmd` and the folder `.mvn`.
.