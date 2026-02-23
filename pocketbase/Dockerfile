FROM alpine:3.19
ARG PB_VERSION=0.25.0
ARG TARGETARCH
RUN apk add --no-cache wget unzip ca-certificates
RUN wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
    -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /app \
    && rm /tmp/pb.zip \
    && chmod +x /app/pocketbase
WORKDIR /app
EXPOSE 8090
CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8090"]
