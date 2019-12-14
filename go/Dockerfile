FROM golang:1.13.5 as go-questions-backend

# Enable go command
RUN export PATH=$PATH:/usr/local/go/bin

# Path where all go projects and libraries will be installed
ENV GOPATH=/home/app/go-questions-backend
ENV GOBIN=$GOPATH/bin
ENV PATH=$GOBIN:/usr/local/go/bin:$PATH

# The project will be in $GOPATH/src/
ADD . $GOPATH

WORKDIR $GOPATH
