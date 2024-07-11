# Example using Debian-based image
FROM debian:buster

# Set the working directory in the container
WORKDIR /usr/src/app

# Install GCC and necessary development tools
RUN apt-get update \
    && apt-get install -y \
        gcc \
        libc6-dev \
        make \
        librabbitmq-dev \
        libjansson-dev \
        libpthread-stubs0-dev

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Compile the C code
RUN gcc -o myapp amqListenernPublisher.c -lrabbitmq -ljansson -lpthread