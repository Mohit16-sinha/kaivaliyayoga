# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install build dependencies (GCC needed for SQLite)
RUN apk add --no-cache gcc musl-dev sqlite-dev

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates sqlite-libs

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/main .

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 8080

CMD ["./main"]
